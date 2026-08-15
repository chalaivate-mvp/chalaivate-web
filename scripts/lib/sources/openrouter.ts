import { OpenRouterResponse } from "../schema";
import { fetchJson, type FetchLike } from "../http";

const ENDPOINT = "https://openrouter.ai/api/v1/models";

export type PriceAndContext = {
  contextWindow: number | null;
  maxOutputTokens: number | null;
  pricing: { input: number | null; output: number | null };
};

/**
 * OpenRouter — ราคาและ context window
 * เปิดสาธารณะ ไม่ต้องใช้ API key
 *
 * ราคาที่ได้เป็น USD ต่อ 1 token และส่งมาเป็น string เช่น "0.000005"
 * เว็บเราแสดงเป็น USD ต่อ 1M tokens จึงต้องคูณล้าน — ถ้าลืมจะได้ราคา $0.00 หมด
 */
const PER_MILLION = 1_000_000;

export async function fetchOpenRouter(
  fetchImpl?: FetchLike,
): Promise<Map<string, PriceAndContext>> {
  const raw = await fetchJson(ENDPOINT, { fetchImpl });
  const parsed = OpenRouterResponse.parse(raw);

  const byId = new Map<string, PriceAndContext>();
  for (const m of parsed.data) {
    const input = m.pricing?.prompt ?? null;
    const output = m.pricing?.completion ?? null;
    byId.set(m.id.toLowerCase(), {
      contextWindow: m.context_length,
      maxOutputTokens: m.top_provider?.max_completion_tokens ?? null,
      pricing: {
        input: input === null ? null : input * PER_MILLION,
        output: output === null ? null : output * PER_MILLION,
      },
    });
  }
  return byId;
}

export function lookupOpenRouter(
  index: Map<string, PriceAndContext>,
  slug: string | null,
): PriceAndContext | null {
  if (!slug) return null;
  return index.get(slug.toLowerCase()) ?? null;
}
