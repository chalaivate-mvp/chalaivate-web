#!/usr/bin/env tsx
/**
 * ดึงข้อมูลโมเดล AI และข่าวสาร แล้วเขียนลง src/data/
 *
 *   npm run fetch:ai            ดึงจริงแล้วเขียนไฟล์
 *   npm run fetch:ai -- --dry   ดึงจริงแต่ไม่เขียน (ดูว่าจะได้อะไร)
 *
 * ตัวแปรแวดล้อม
 *   ARTIFICIAL_ANALYSIS_API_KEY  ไม่มีก็รันได้ แต่จะไม่มีคะแนน benchmark
 *   ANTHROPIC_API_KEY            ไม่มีก็รันได้ แต่ข่าวจะไม่ถูกแปลเป็นไทย
 *
 * หลักการ: ล้มเหลวแบบดัง ไม่ใช่แบบเงียบ
 * ถ้าตรวจไม่ผ่านสักด่าน จะไม่เขียนไฟล์เลยและ exit code ไม่เป็นศูนย์
 * ข้อมูลเดิมยังอยู่ครบ ดีกว่าเขียนทับด้วยของเสีย
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { Catalog, OutputDataset, OutputNews } from "./lib/schema";
import { fetchOpenRouter } from "./lib/sources/openrouter";
import { fetchArtificialAnalysis, lookupAa } from "./lib/sources/artificial-analysis";
import {
  DEFAULT_FEEDS,
  fetchFeeds,
  matchRelatedModels,
  summarizeToThai,
} from "./lib/sources/news";
import { mergeModels, sanityCheck, explainMissing } from "./lib/merge";
import type { OutputDatasetT } from "./lib/schema";

const ROOT = process.cwd();
const CATALOG_PATH = join(ROOT, "data/model-catalog.json");
const MODELS_OUT = join(ROOT, "src/data/ai-models.json");
const NEWS_OUT = join(ROOT, "src/data/ai-news.json");

const dryRun = process.argv.includes("--dry");

const log = (msg: string) => console.log(msg);
const warn = (msg: string) => console.warn(`  ! ${msg}`);

function readJson<T>(path: string): T | null {
  try {
    return JSON.parse(readFileSync(path, "utf8")) as T;
  } catch {
    return null;
  }
}

async function main() {
  const startedAt = new Date();
  const fetchedAt = startedAt.toISOString();
  const updatedAt = fetchedAt.slice(0, 10);

  const catalogRaw = readJson<unknown>(CATALOG_PATH);
  if (!catalogRaw) throw new Error(`อ่าน ${CATALOG_PATH} ไม่ได้`);
  const catalog = Catalog.parse(catalogRaw);
  log(`catalog: ${catalog.models.length} โมเดล`);

  const ok: string[] = [];
  const failed: { source: string; reason: string }[] = [];

  /* ── OpenRouter: ราคา + context window (ไม่ต้องใช้ key) ── */
  let openRouter = null;
  try {
    openRouter = await fetchOpenRouter();
    ok.push("OpenRouter");
    log(`OpenRouter: ${openRouter.size} โมเดลในแคตตาล็อก`);
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    failed.push({ source: "OpenRouter", reason });
    warn(`OpenRouter ล้มเหลว: ${reason}`);
  }

  /* ── Artificial Analysis: benchmark + ดัชนี (ต้องใช้ key) ── */
  let aa = null;
  try {
    aa = await fetchArtificialAnalysis(
      process.env.ARTIFICIAL_ANALYSIS_API_KEY ?? "",
    );
    ok.push("Artificial Analysis");
    const mapped = Object.entries(aa.matchedFields)
      .map(([k, v]) => `${k}=${v ?? "ไม่พบ"}`)
      .join(", ");
    log(`Artificial Analysis: ${aa.byKey.size} รายการ`);
    log(`  field ที่จับคู่ได้: ${mapped}`);

    // จับคู่ไม่ได้ = เดาชื่อผิด ให้พิมพ์ชื่อจริงทั้งหมดออกมาเลยจะได้เลิกเดา
    const unmatched = Object.entries(aa.matchedFields)
      .filter(([, v]) => v === null)
      .map(([k]) => k);
    if (unmatched.length) {
      const { withValues, allNull } = aa.availableFields;
      log(`  ยังจับคู่ไม่ได้: ${unmatched.join(", ")}`);
      log(`  field ที่ API ส่งมาและมีค่าจริง (${withValues.length}):`);
      log(`    ${withValues.join(", ")}`);
      if (allNull.length) {
        log(`  field ที่มีอยู่แต่เป็น null ทุกโมเดล — เขาเลิกวัดแล้ว (${allNull.length}):`);
        log(`    ${allNull.join(", ")}`);
      }
    }

    // รายการข้างบนรวมทั้งคลัง 1792 รายการ ซึ่งตอบไม่ได้ว่า "10 ตัวที่เราเลือก" มีอะไร
    // benchmark ที่คลังมีแต่ไม่ได้วัดกับโมเดลเรา จะโผล่ข้างบนแต่ยังเป็น null ในตาราง
    const ours = new Set<string>();
    for (const m of catalog.models) {
      lookupAa(aa, m.sources.artificialAnalysis)?.presentFields.forEach((f) =>
        ours.add(f),
      );
    }
    log(`  field ที่โมเดลใน catalog มีจริง (${ours.size}):`);
    log(`    ${[...ours].sort().join(", ")}`);
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    failed.push({ source: "Artificial Analysis", reason });
    warn(`Artificial Analysis ล้มเหลว: ${reason}`);
  }

  /* ── รวมข้อมูล + ตรวจ ── */
  const previous = readJson<OutputDatasetT>(MODELS_OUT);
  const merged = mergeModels({
    catalog,
    openRouter,
    aa,
    fetchedAt,
    updatedAt,
    ok,
    failed,
  });

  const parsed = OutputDataset.safeParse(merged);
  if (!parsed.success) {
    console.error("ผลลัพธ์ไม่ผ่าน schema — ไม่เขียนไฟล์");
    console.error(parsed.error.issues.slice(0, 10));
    process.exitCode = 1;
    return;
  }

  const problems = sanityCheck(parsed.data, previous);
  if (problems.length) {
    console.error("ตรวจความสมเหตุสมผลไม่ผ่าน — ไม่เขียนไฟล์:");
    for (const p of problems) console.error(`  - ${p}`);
    process.exitCode = 1;
    return;
  }

  const { actual, expected } = parsed.data.provenance.filled;
  log(
    `รวมข้อมูล: ${actual}/${expected} ช่อง · status = ${parsed.data.status}`,
  );
  if (parsed.data.status === "sample") {
    warn(
      "ยังไม่ครบทุกช่อง — หน้าเว็บจะยังขึ้นแบนเนอร์เตือนและไม่ปล่อย Dataset JSON-LD",
    );
    // ขาดกระจายทุกโมเดล = field เปลี่ยนชื่อ · ขาดเฉพาะบางโมเดล = slug ผิด
    //
    // บอกว่า slug ไหนผิดยังไม่พอ ต้องบอกด้วยว่าที่ถูกคืออะไร ไม่งั้นคนแก้ก็ต้องเดาอยู่ดี
    // จึงพิมพ์คีย์ที่ปลายทางมีจริงและใกล้เคียงกับที่ตั้งไว้ ให้เลือกจากของจริงเท่านั้น
    const orKeys = openRouter ? [...openRouter.keys()] : [];
    const aaKeys = aa ? [...aa.byKey.keys()] : [];

    /**
     * ตัดชื่อค่ายหน้า "/" ออกก่อน แล้วเอาคำแรกที่ยาวพอเป็นตัวค้น
     *
     * AA ลง index ทั้ง slug และ "ชื่อเต็มที่มีเว้นวรรค" ถ้าเรียงตามตัวอักษรเฉย ๆ
     * ชื่อที่มีเว้นวรรคจะมาก่อนทั้งหมด (0x20 < 0x2D) แล้วดัน slug ตกรายการ
     * จึงต้องเอา slug ขึ้นก่อน และบอกจำนวนเต็มไว้ด้วยว่าตัดไปกี่ตัว
     */
    const near = (slug: string | null, keys: string[]) => {
      const tail = (slug ?? "").split("/").pop() ?? "";
      const tokens = tail
        .split(/[^a-z0-9]+/i)
        .filter(Boolean)
        .map((t) => t.toLowerCase());
      if (!tokens.length) return "ไม่มีคำค้น";

      // ให้คะแนนตามความยาวคำที่ตรง คำยาวอย่าง "397b" จำเพาะกว่าเลขโดด ๆ อย่าง "5"
      // เรียงตามคะแนนแล้วค่อยเอาตัวสั้นก่อน ตัวที่ใช่จะลอยขึ้นหัวรายการเสมอ
      const score = (k: string) =>
        tokens.reduce((n, t) => (k.includes(t) ? n + t.length : n), 0);
      const ranked = keys
        .map((k) => ({ k, s: score(k) }))
        .filter((x) => x.s > 0)
        .sort((a, b) => b.s - a.s || a.k.length - b.k.length || a.k.localeCompare(b.k));
      if (!ranked.length) return "ไม่เจอสักตัว";

      const pick = ranked.slice(0, 20);
      const more = ranked.length - pick.length;
      return `${pick.map((x) => x.k).join(", ")}${more > 0 ? ` … อีก ${more} ตัว` : ""}`;
    };

    for (const row of explainMissing(parsed.data)) {
      log(`    ${row.id}: ขาด ${row.missing.join(", ")}`);
      const m = catalog.models.find((x) => x.id === row.id);
      if (!m) continue;
      if (row.missing.some((s) => s.includes("OpenRouter"))) {
        const slug = m.sources.openrouter;
        log(`      OpenRouter ตั้งไว้ ${slug} → ที่มีจริง: ${near(slug, orKeys)}`);
      }
      if (row.missing.some((s) => s.includes("(AA)"))) {
        const slug = m.sources.artificialAnalysis;
        log(`      AA ตั้งไว้ ${slug} → ที่มีจริง: ${near(slug, aaKeys)}`);
      }
    }
  }

  /* ── ข่าว ── */
  const articles = await fetchFeeds(DEFAULT_FEEDS, {
    sinceDays: 21,
    onError: (feed, reason) => {
      failed.push({ source: `RSS ${feed.name}`, reason });
      warn(`feed ${feed.name} ล้มเหลว: ${reason}`);
    },
  });
  log(`ข่าว: ดึงมา ${articles.length} รายการ`);

  const top = articles.slice(0, 12);
  const summaries = await summarizeToThai(top, {
    apiKey: process.env.ANTHROPIC_API_KEY,
    onError: (reason) => warn(`สรุปข่าวเป็นไทยไม่สำเร็จ: ${reason}`),
  });
  const translated = summaries.filter(Boolean).length;
  if (top.length) log(`  แปลไทยสำเร็จ ${translated}/${top.length} รายการ`);

  const newsItems = top.map((a, i) => {
    const s = summaries[i];
    return {
      // id ต้องคงที่ข้ามรอบ ไม่งั้น React จะ remount การ์ดทุกวัน
      id: `news-${a.publishedAt}-${a.link.replace(/[^a-z0-9]+/gi, "-").slice(-40)}`,
      title: s?.titleTh ?? a.title,
      summary: s?.summaryTh ?? a.description.slice(0, 200),
      source: a.source,
      url: a.link,
      publishedAt: a.publishedAt,
      category: s?.category ?? a.fallbackCategory,
      relatedModels: matchRelatedModels(a, catalog.models),
    };
  });

  const news = OutputNews.safeParse({
    // ข่าวถือว่า live เมื่อดึงมาได้จริง แม้จะยังไม่ได้แปล — เนื้อหาเป็นของจริง
    status: newsItems.length > 0 ? "live" : "sample",
    updatedAt,
    items: newsItems,
  });
  if (!news.success) {
    console.error("ข่าวไม่ผ่าน schema — ไม่เขียนไฟล์");
    console.error(news.error.issues.slice(0, 10));
    process.exitCode = 1;
    return;
  }

  /* ── เขียนไฟล์ ── */
  if (dryRun) {
    log("\n--dry: ไม่เขียนไฟล์");
    log(`  จะเขียน ${parsed.data.models.length} โมเดล และ ${news.data.items.length} ข่าว`);
    return;
  }

  // ข่าวว่างเปล่าแปลว่า feed ล่มหมด ไม่ใช่ว่าไม่มีข่าว — เก็บของเดิมไว้ดีกว่า
  if (news.data.items.length === 0) {
    warn("ไม่ได้ข่าวเลยสักรายการ — คงไฟล์ข่าวเดิมไว้");
  } else {
    writeFileSync(NEWS_OUT, JSON.stringify(news.data, null, 2) + "\n");
    log(`เขียน ${NEWS_OUT}`);
  }

  writeFileSync(MODELS_OUT, JSON.stringify(parsed.data, null, 2) + "\n");
  log(`เขียน ${MODELS_OUT}`);

  const seconds = ((Date.now() - startedAt.getTime()) / 1000).toFixed(1);
  log(`\nเสร็จใน ${seconds} วินาที · สำเร็จ ${ok.length} แหล่ง · ล้มเหลว ${failed.length}`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.stack : err);
  process.exitCode = 1;
});
