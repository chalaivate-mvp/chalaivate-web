import { XMLParser } from "fast-xml-parser";
import { z } from "zod";
import { fetchText, type FetchLike } from "../http";
import type { CatalogModelT } from "../schema";

/**
 * ข่าววงการ AI จาก RSS/Atom แล้วสรุปเป็นไทยด้วย Claude API
 *
 * feed แต่ละเจ้าเปลี่ยน URL/หยุดให้บริการได้ตลอด — ตัวไหนล่มให้ข้ามพร้อมบันทึกเหตุผล
 * ไม่ใช่ล้มทั้ง pipeline เพราะ feed เดียว
 */

export type FeedSource = {
  name: string;
  url: string;
  /** หมวดตั้งต้นถ้า Claude จัดหมวดให้ไม่ได้ */
  fallbackCategory: NewsCategory;
};

type NewsCategory =
  | "model-release"
  | "research"
  | "product"
  | "business"
  | "policy";

export const DEFAULT_FEEDS: FeedSource[] = [
  {
    name: "Anthropic",
    url: "https://www.anthropic.com/news/rss.xml",
    fallbackCategory: "product",
  },
  {
    name: "OpenAI",
    url: "https://openai.com/news/rss.xml",
    fallbackCategory: "product",
  },
  {
    name: "Google DeepMind",
    url: "https://deepmind.google/blog/rss.xml",
    fallbackCategory: "research",
  },
  {
    name: "Hugging Face",
    url: "https://huggingface.co/blog/feed.xml",
    fallbackCategory: "research",
  },
];

export type RawArticle = {
  title: string;
  link: string;
  publishedAt: string;
  source: string;
  /** คำอธิบายจาก feed — ใช้เป็นวัตถุดิบให้ Claude สรุป */
  description: string;
  fallbackCategory: NewsCategory;
};

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
});

function stripHtml(input: string): string {
  return input
    .replace(/<[^>]*>/g, " ")
    .replace(/&[a-z]+;|&#\d+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function toIsoDate(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
}

/** รองรับทั้ง RSS 2.0 (channel.item) และ Atom (feed.entry) */
export function parseFeed(xml: string, feed: FeedSource): RawArticle[] {
  const doc = parser.parse(xml) as Record<string, unknown>;

  const rss = (doc.rss as { channel?: { item?: unknown } } | undefined)?.channel;
  const atom = doc.feed as { entry?: unknown } | undefined;
  const entries = (rss?.item ?? atom?.entry ?? []) as unknown;
  const list = Array.isArray(entries) ? entries : [entries];

  const out: RawArticle[] = [];
  for (const raw of list) {
    if (!raw || typeof raw !== "object") continue;
    const e = raw as Record<string, unknown>;

    const title = typeof e.title === "string" ? e.title : (e.title as { "#text"?: string })?.["#text"];
    // Atom เก็บ URL ไว้ใน attribute ของ <link href="...">
    const link =
      typeof e.link === "string"
        ? e.link
        : ((e.link as { "@_href"?: string })?.["@_href"] ??
          (Array.isArray(e.link)
            ? (e.link[0] as { "@_href"?: string })?.["@_href"]
            : undefined));
    const published = toIsoDate(e.pubDate ?? e.published ?? e.updated);
    const description = stripHtml(
      String(e.description ?? e.summary ?? (e.content as { "#text"?: string })?.["#text"] ?? ""),
    );

    if (!title || !link || !published) continue;
    out.push({
      title: String(title).trim(),
      link: String(link).trim(),
      publishedAt: published,
      source: feed.name,
      description: description.slice(0, 600),
      fallbackCategory: feed.fallbackCategory,
    });
  }
  return out;
}

export async function fetchFeeds(
  feeds: FeedSource[],
  {
    sinceDays = 14,
    fetchImpl,
    onError,
  }: {
    sinceDays?: number;
    fetchImpl?: FetchLike;
    onError?: (feed: FeedSource, reason: string) => void;
  } = {},
): Promise<RawArticle[]> {
  const cutoff = new Date(Date.now() - sinceDays * 86_400_000)
    .toISOString()
    .slice(0, 10);

  const results = await Promise.all(
    feeds.map(async (feed) => {
      try {
        const xml = await fetchText(feed.url, { fetchImpl });
        return parseFeed(xml, feed);
      } catch (err) {
        onError?.(feed, err instanceof Error ? err.message : String(err));
        return [];
      }
    }),
  );

  const seen = new Set<string>();
  return results
    .flat()
    .filter((a) => a.publishedAt >= cutoff)
    .filter((a) => (seen.has(a.link) ? false : (seen.add(a.link), true)))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

/** จับคู่ข่าวกับโมเดลจากคำที่ปรากฏในหัวข้อ/คำอธิบาย */
export function matchRelatedModels(
  article: RawArticle,
  catalog: CatalogModelT[],
): string[] {
  const haystack = `${article.title} ${article.description}`.toLowerCase();
  return catalog
    .filter((m) => {
      const needles = [m.name, m.shortName, m.vendor]
        .map((s) => s.toLowerCase())
        .filter((s) => s.length >= 3);
      return needles.some((n) => haystack.includes(n));
    })
    .map((m) => m.id);
}

/* ────────────── สรุปเป็นไทยด้วย Claude ────────────── */

const SummarySchema = z.object({
  items: z.array(
    z.object({
      index: z.number().int(),
      titleTh: z.string(),
      summaryTh: z.string(),
      category: z.enum([
        "model-release",
        "research",
        "product",
        "business",
        "policy",
      ]),
    }),
  ),
});

export type Summarized = {
  titleTh: string;
  summaryTh: string;
  category: NewsCategory;
};

/**
 * แปลและสรุปข่าวเป็นไทย
 *
 * ส่งทุกข่าวไปในคำขอเดียว ไม่ใช่ยิงทีละข่าว — ถูกกว่าและเร็วกว่ามาก
 * ถ้าไม่มี ANTHROPIC_API_KEY หรือ API ล้มเหลว จะคืน null แล้วให้ตัวเรียกใช้
 * หัวข้อภาษาอังกฤษต้นฉบับแทน ข่าวยังขึ้นเว็บได้ แค่ไม่ได้แปล
 */
export async function summarizeToThai(
  articles: RawArticle[],
  {
    apiKey,
    onError,
  }: { apiKey: string | undefined; onError?: (reason: string) => void },
): Promise<(Summarized | null)[]> {
  const empty = articles.map(() => null);
  if (!apiKey || articles.length === 0) {
    if (!apiKey) onError?.("ไม่ได้ตั้ง ANTHROPIC_API_KEY — ข้ามการแปลไทย");
    return empty;
  }

  try {
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    const { zodOutputFormat } = await import("@anthropic-ai/sdk/helpers/zod");
    const client = new Anthropic({ apiKey });

    const payload = articles
      .map(
        (a, i) =>
          `[${i}] ${a.title}\nแหล่ง: ${a.source} · ${a.publishedAt}\n${a.description}`,
      )
      .join("\n\n");

    const response = await client.messages.parse({
      model: "claude-opus-5",
      max_tokens: 16000,
      system:
        "คุณเป็นบรรณาธิการข่าวเทคโนโลยีของ 9Expert Training แปลและสรุปข่าว AI เป็นภาษาไทย " +
        "สำหรับผู้อ่านระดับเริ่มต้นถึงกลาง เก็บศัพท์เทคนิคเป็นภาษาอังกฤษไว้ตามเดิม " +
        "summaryTh ยาว 1-2 ประโยค บอกว่าเกิดอะไรขึ้นและสำคัญอย่างไร " +
        "ห้ามเติมข้อมูลที่ไม่มีในต้นฉบับ ถ้าต้นฉบับไม่ได้บอกตัวเลขก็อย่าใส่ตัวเลขเอง",
      messages: [
        {
          role: "user",
          content: `สรุปข่าวต่อไปนี้เป็นภาษาไทย ตอบให้ครบทุกรายการตาม index เดิม:\n\n${payload}`,
        },
      ],
      output_config: { format: zodOutputFormat(SummarySchema) },
    });

    // safety classifier ปฏิเสธได้ ต้องเช็คก่อนอ่าน content
    if (response.stop_reason === "refusal") {
      onError?.("Claude ปฏิเสธคำขอสรุปข่าว — ใช้หัวข้อต้นฉบับแทน");
      return empty;
    }

    const parsed = response.parsed_output;
    if (!parsed) {
      onError?.("ผลลัพธ์ไม่ตรง schema — ใช้หัวข้อต้นฉบับแทน");
      return empty;
    }

    const byIndex = new Map(parsed.items.map((it) => [it.index, it]));
    return articles.map((_, i) => {
      const hit = byIndex.get(i);
      return hit
        ? {
            titleTh: hit.titleTh,
            summaryTh: hit.summaryTh,
            category: hit.category,
          }
        : null;
    });
  } catch (err) {
    onError?.(err instanceof Error ? err.message : String(err));
    return empty;
  }
}
