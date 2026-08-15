import type { CatalogT, CatalogModelT, OutputDatasetT } from "./schema";
import { lookupOpenRouter, type PriceAndContext } from "./sources/openrouter";
import { lookupAa, type AaResult } from "./sources/artificial-analysis";

/**
 * รวม catalog (คนเขียน) + ข้อมูลที่ดึงมา (เครื่องดึง) เป็นชุดเดียว
 *
 * กติกาสำคัญ: ถ้าแหล่งข้อมูลไม่มีค่าให้ ผลลัพธ์เป็น null เสมอ — ห้ามเดา
 * ห้ามใช้ค่าเดิมจากรอบก่อนมาแทน เพราะจะกลายเป็นตัวเลขเก่าที่ดูเหมือนสด
 */

export type MergeInput = {
  catalog: CatalogT;
  openRouter: Map<string, PriceAndContext> | null;
  aa: AaResult | null;
  fetchedAt: string;
  updatedAt: string;
  ok: string[];
  failed: { source: string; reason: string }[];
};

/** ช่องข้อมูลที่ pipeline รับผิดชอบเติม — ใช้นับความครบถ้วน */
const FETCHED_FIELDS_PER_MODEL = 5;

export function mergeModels(input: MergeInput): OutputDatasetT {
  const { catalog, openRouter, aa } = input;

  let actual = 0;
  const expected = catalog.models.length * FETCHED_FIELDS_PER_MODEL;

  const models = catalog.models.map((m: CatalogModelT) => {
    const or = openRouter ? lookupOpenRouter(openRouter, m.sources.openrouter) : null;
    const metrics = aa ? lookupAa(aa, m.sources.artificialAnalysis) : null;

    const benchmarks: Record<string, number | null> = {};
    for (const meta of catalog.benchmarkMeta) {
      benchmarks[meta.key] = metrics?.benchmarks[meta.key] ?? null;
    }

    const contextWindow = or?.contextWindow ?? null;
    const pricingInput = or?.pricing.input ?? null;
    const intelligence = metrics?.indices.intelligence ?? null;
    const tokensPerSecond = metrics?.speed.tokensPerSecond ?? null;
    const anyBenchmark = Object.values(benchmarks).some((v) => v !== null);

    // นับเฉพาะช่องตัวแทนของแต่ละแหล่ง ไม่นับทุก field เพราะบาง benchmark
    // ไม่มีค่าเป็นเรื่องปกติ (ผู้ให้บริการยังไม่ได้วัด)
    for (const filled of [
      contextWindow !== null,
      pricingInput !== null,
      intelligence !== null,
      tokensPerSecond !== null,
      anyBenchmark,
    ]) {
      if (filled) actual++;
    }

    return {
      id: m.id,
      name: m.name,
      shortName: m.shortName,
      vendor: m.vendor,
      releaseDate: m.releaseDate,
      openWeights: m.openWeights,
      license: m.license,
      contextWindow,
      maxOutputTokens: or?.maxOutputTokens ?? null,
      pricing: {
        input: pricingInput,
        output: or?.pricing.output ?? null,
      },
      benchmarks,
      indices: {
        intelligence,
        coding: metrics?.indices.coding ?? null,
        agentic: metrics?.indices.agentic ?? null,
      },
      speed: {
        tokensPerSecond,
        firstTokenSeconds: metrics?.speed.firstTokenSeconds ?? null,
      },
      features: m.features,
      strengths: m.strengths,
      weaknesses: m.weaknesses,
      bestFor: m.bestFor,
    };
  });

  return {
    // "live" เฉพาะเมื่อทุกโมเดลได้ข้อมูลครบทุกช่องที่ pipeline รับผิดชอบ
    // ครบไม่พอ = ยังเป็น sample แบนเนอร์เตือนยังขึ้น และ Dataset JSON-LD ยังไม่ออก
    status: actual === expected ? "live" : "sample",
    updatedAt: input.updatedAt,
    provenance: {
      fetchedAt: input.fetchedAt,
      ok: input.ok,
      failed: input.failed,
      filled: { actual, expected },
    },
    benchmarkMeta: catalog.benchmarkMeta,
    sources: catalog.dataSources,
    models,
  };
}

/**
 * ตรวจความสมเหตุสมผลก่อนเขียนทับไฟล์จริง
 *
 * zod จับ "ผิดรูป" ได้ แต่จับ "ถูกรูปแต่เพี้ยน" ไม่ได้ เช่น API เปลี่ยนหน่วยราคา
 * จาก per-token เป็น per-million แล้วราคาพุ่งขึ้นล้านเท่า — schema ยังผ่านสบาย
 * ด่านนี้จึงเทียบกับข้อมูลรอบก่อนเพื่อจับความเปลี่ยนแปลงที่ผิดปกติ
 */
export function sanityCheck(
  next: OutputDatasetT,
  previous: OutputDatasetT | null,
): string[] {
  const problems: string[] = [];

  for (const m of next.models) {
    const { input, output } = m.pricing;
    if (input !== null && input > 1000)
      problems.push(`${m.id}: ราคา input $${input}/1M สูงผิดปกติ — หน่วยอาจเพี้ยน`);
    if (output !== null && output > 1000)
      problems.push(`${m.id}: ราคา output $${output}/1M สูงผิดปกติ — หน่วยอาจเพี้ยน`);
    if (m.contextWindow !== null && m.contextWindow < 1000)
      problems.push(`${m.id}: context window ${m.contextWindow} เล็กผิดปกติ`);
  }

  if (previous) {
    const prevById = new Map(previous.models.map((m) => [m.id, m]));
    for (const m of next.models) {
      const old = prevById.get(m.id);
      if (!old) continue;

      // ราคาขยับเกิน 10 เท่าในวันเดียวแทบเป็นไปไม่ได้ — น่าจะหน่วยเปลี่ยน
      for (const key of ["input", "output"] as const) {
        const a = old.pricing[key];
        const b = m.pricing[key];
        if (a !== null && b !== null && a > 0 && (b / a > 10 || a / b > 10)) {
          problems.push(
            `${m.id}: ราคา ${key} เปลี่ยนจาก $${a} เป็น $${b} — เกิน 10 เท่า`,
          );
        }
      }
    }

    // ข้อมูลหายยกแผงมักแปลว่า slug ในแหล่งข้อมูลเปลี่ยน ไม่ใช่โมเดลแย่ลง
    if (
      previous.provenance &&
      previous.provenance.filled.actual > 0 &&
      next.provenance.filled.actual < previous.provenance.filled.actual * 0.5
    ) {
      problems.push(
        `ข้อมูลที่ดึงได้ลดจาก ${previous.provenance.filled.actual} เหลือ ` +
          `${next.provenance.filled.actual} ช่อง — slug ในแหล่งข้อมูลอาจเปลี่ยน`,
      );
    }
  }

  return problems;
}
