import { z } from "zod";

/**
 * Schema ของ "ข้อมูลเข้า" จาก API ภายนอก
 *
 * หลักการ: ผ่อนปรนกับสิ่งที่ไม่ได้ใช้ เข้มกับสิ่งที่เอาไปแสดงจริง
 * API ของคนอื่นเพิ่ม/เปลี่ยน field ได้ตลอด ถ้า schema เข้มเกินไปทั้ง pipeline
 * จะพังเพราะ field ที่เราไม่ได้ใช้ด้วยซ้ำ — จึงใช้ passthrough แล้วเลือกอ่าน
 * เฉพาะที่ต้องการ แต่ค่าที่จะเอาไปโชว์ต้องเป็นตัวเลขจริงเท่านั้น
 */

/** ตัวเลขที่ API อาจส่งมาเป็น string ("0.000005") หรือ number */
const numericLoose = z
  .union([z.number(), z.string()])
  .nullish()
  .transform((v) => {
    if (v === null || v === undefined || v === "") return null;
    const n = typeof v === "string" ? Number(v) : v;
    return Number.isFinite(n) ? n : null;
  });

/* ────────────── OpenRouter ────────────── */

export const OpenRouterModel = z
  .object({
    id: z.string(),
    name: z.string().nullish(),
    context_length: numericLoose,
    // ราคาเป็น USD ต่อ 1 token และมาเป็น string — ต้องคูณล้านเองภายหลัง
    pricing: z
      .object({ prompt: numericLoose, completion: numericLoose })
      .partial()
      .passthrough()
      .nullish(),
    top_provider: z
      .object({ max_completion_tokens: numericLoose })
      .partial()
      .passthrough()
      .nullish(),
  })
  .passthrough();

export const OpenRouterResponse = z.object({
  data: z.array(OpenRouterModel),
});

/* ────────────── Artificial Analysis ────────────── */

/**
 * ชื่อ field ย่อยใน evaluations ยังยืนยันไม่ได้จากเอกสารสาธารณะ
 * จึงรับเป็น record ของตัวเลขไว้ก่อน แล้วให้ adapter จับคู่ชื่อเอง
 * (ดู EVAL_ALIASES ใน sources/artificial-analysis.ts)
 */
export const AaModel = z
  .object({
    id: z.string().nullish(),
    slug: z.string().nullish(),
    name: z.string(),
    model_creator: z
      .object({ name: z.string().nullish(), slug: z.string().nullish() })
      .partial()
      .passthrough()
      .nullish(),
    evaluations: z.record(z.string(), numericLoose).nullish(),
    pricing: z.record(z.string(), numericLoose).nullish(),
    median_output_tokens_per_second: numericLoose,
    median_time_to_first_token_seconds: numericLoose,
  })
  .passthrough();

export const AaResponse = z.object({
  data: z.array(AaModel),
});

/* ────────────── Catalog (ไฟล์ในโปรเจกต์เอง) ────────────── */

export const CatalogModel = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  shortName: z.string().min(1),
  vendor: z.string().min(1),
  releaseDate: z.string().nullable(),
  openWeights: z.boolean(),
  license: z.string().nullable(),
  sources: z.object({
    openrouter: z.string().nullable(),
    artificialAnalysis: z.string().nullable(),
  }),
  features: z.object({
    multimodal: z.boolean(),
    toolUse: z.boolean(),
    webSearch: z.boolean(),
    mcp: z.enum(["native", "wrapper", "none"]),
    documentHandling: z.boolean(),
    scheduling: z.boolean(),
  }),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  bestFor: z.array(z.string()),
});

export const Catalog = z.object({
  models: z.array(CatalogModel).min(1),
  benchmarkMeta: z.array(
    z.object({
      key: z.string(),
      label: z.string(),
      description: z.string(),
      unit: z.literal("percent"),
    }),
  ),
  dataSources: z.array(
    z.object({
      name: z.string(),
      url: z.string().url(),
      attribution: z.string().optional(),
    }),
  ),
});

/* ────────────── ผลลัพธ์ที่จะเขียนลงไฟล์ ────────────── */

/**
 * ด่านสุดท้ายก่อนเขียนทับไฟล์ที่เว็บใช้จริง — ต้องเข้มที่สุด
 * ถ้าไม่ผ่านตรงนี้ pipeline จะไม่เขียนอะไรเลย ข้อมูลเดิมยังอยู่ครบ
 */
const pct = z.number().min(0).max(100).nullable();

export const OutputModel = z.object({
  id: z.string(),
  name: z.string(),
  shortName: z.string(),
  vendor: z.string(),
  releaseDate: z.string().nullable(),
  openWeights: z.boolean(),
  license: z.string().nullable(),
  contextWindow: z.number().int().positive().nullable(),
  maxOutputTokens: z.number().int().positive().nullable(),
  pricing: z.object({
    input: z.number().min(0).nullable(),
    output: z.number().min(0).nullable(),
  }),
  benchmarks: z.record(z.string(), pct),
  indices: z.object({
    intelligence: pct,
    coding: pct,
  }),
  speed: z.object({
    tokensPerSecond: z.number().min(0).nullable(),
    firstTokenSeconds: z.number().min(0).nullable(),
  }),
  features: CatalogModel.shape.features,
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  bestFor: z.array(z.string()),
});

export const OutputDataset = z.object({
  status: z.enum(["sample", "live"]),
  updatedAt: z.string(),
  provenance: z.object({
    fetchedAt: z.string(),
    ok: z.array(z.string()),
    failed: z.array(z.object({ source: z.string(), reason: z.string() })),
    filled: z.object({
      actual: z.number().int().min(0),
      expected: z.number().int().min(0),
    }),
  }),
  benchmarkMeta: Catalog.shape.benchmarkMeta,
  sources: Catalog.shape.dataSources,
  models: z.array(OutputModel).min(1),
});

export const OutputNewsItem = z.object({
  id: z.string(),
  title: z.string().min(1),
  summary: z.string().min(1),
  source: z.string().min(1),
  url: z.string().url(),
  publishedAt: z.string(),
  category: z.enum(["model-release", "research", "product", "business", "policy"]),
  relatedModels: z.array(z.string()),
});

export const OutputNews = z.object({
  status: z.enum(["sample", "live"]),
  updatedAt: z.string(),
  items: z.array(OutputNewsItem),
});

export type CatalogT = z.infer<typeof Catalog>;
export type CatalogModelT = z.infer<typeof CatalogModel>;
export type OutputDatasetT = z.infer<typeof OutputDataset>;
export type OutputNewsT = z.infer<typeof OutputNews>;
