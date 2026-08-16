/**
 * Schema สำหรับ Artifacts — AI Models Comparison
 *
 * ไฟล์ JSON ใน src/data/ ถูกเขียนทับโดย pipeline ใน Phase 2
 * (GitHub Actions → scripts/fetch-ai-data.ts) ดังนั้น "อย่าแก้ shape นี้
 * โดยไม่แก้ script ตาม" — ฝั่ง fetch จะ validate ด้วย zod ก่อนเขียนลงดิสก์
 */

/** benchmark ที่แสดงเป็นกราฟ — key ต้องตรงกับ Model["benchmarks"] */
export type BenchmarkKey = "mmlu" | "gpqa" | "aime" | "hle";

export type BenchmarkMeta = {
  key: BenchmarkKey;
  /** ชื่อสั้นสำหรับหัวกราฟ/แกน */
  label: string;
  /** อธิบายว่าวัดอะไร — ใช้ใน tooltip */
  description: string;
  /** หน่วย: ทุกตัวตอนนี้เป็น % (0-100) */
  unit: "percent";
};

export type Vendor =
  | "Anthropic"
  | "OpenAI"
  | "Google DeepMind"
  | "Moonshot AI"
  | "xAI"
  | "Z.ai"
  | "Alibaba";

export type Model = {
  /** slug คงที่ — ใช้เป็น key ของสี, URL param และการ join ข้อมูล */
  id: string;
  name: string;
  vendor: Vendor;
  /** ป้ายสั้นบนชิป/แกนกราฟ */
  shortName: string;
  releaseDate: string | null;
  /** true = ปล่อย weights ให้ดาวน์โหลดได้ */
  openWeights: boolean;
  license: string | null;

  contextWindow: number | null;
  maxOutputTokens: number | null;

  /** USD ต่อ 1M tokens */
  pricing: {
    input: number | null;
    output: number | null;
  };

  /** null = ไม่มีข้อมูล (ห้ามเดา — แสดงเป็น "N/A") */
  benchmarks: Record<BenchmarkKey, number | null>;

  /** ดัชนีรวมจาก Artificial Analysis (0-100) */
  indices: {
    intelligence: number | null;
    coding: number | null;
    agentic: number | null;
  };

  speed: {
    /** output tokens ต่อวินาที */
    tokensPerSecond: number | null;
    /** time to first token (วินาที) */
    firstTokenSeconds: number | null;
  };

  features: {
    multimodal: boolean;
    toolUse: boolean;
    webSearch: boolean;
    /** "native" | "wrapper" | "none" */
    mcp: "native" | "wrapper" | "none";
    documentHandling: boolean;
    scheduling: boolean;
  };

  /** ภาษาไทย — 3 ข้อกำลังดี */
  strengths: string[];
  weaknesses: string[];
  bestFor: string[];
};

export type NewsCategory =
  | "model-release"
  | "research"
  | "product"
  | "business"
  | "policy";

export type NewsItem = {
  id: string;
  title: string;
  /** สรุปภาษาไทย 1-2 ประโยค — Phase 2 ให้ Claude API สรุปจากต้นฉบับ */
  summary: string;
  source: string;
  url: string;
  publishedAt: string;
  category: NewsCategory;
  /** slug ของโมเดลที่ข่าวนี้เกี่ยวข้อง — ใช้ filter ร่วมกับ slicer */
  relatedModels: string[];
};

export type DataSource = {
  name: string;
  url: string;
  /** ข้อความ attribution ที่ต้องแสดง (Artificial Analysis บังคับ) */
  attribution?: string;
};

/**
 * บันทึกว่ารอบล่าสุด pipeline ดึงอะไรมาได้บ้าง
 * มีไว้เพื่อให้ตอบได้ว่า "ตัวเลขนี้มาจากไหน" โดยไม่ต้องไปเปิด log ของ Actions
 */
export type Provenance = {
  /** เวลาที่ pipeline รันจริง (ISO) */
  fetchedAt: string;
  /** ชื่อแหล่งที่ดึงสำเร็จในรอบนั้น */
  ok: string[];
  /** แหล่งที่ล้มเหลว พร้อมเหตุผลสั้น ๆ */
  failed: { source: string; reason: string }[];
  /** จำนวนช่องข้อมูลที่ได้ค่าจริง เทียบกับที่ควรมีทั้งหมด */
  filled: { actual: number; expected: number };
};

export type ModelDataset = {
  /**
   * "sample" = ข้อมูลตัวอย่างสำหรับตรวจหน้าจอ ยังไม่ผ่านการ verify
   * "live"   = pipeline ดึงจาก API จริงครบตามเกณฑ์แล้ว
   *
   * หน้าเว็บใช้ค่านี้ตัดสินใจ 2 อย่าง: ขึ้น banner เตือนหรือไม่
   * และปล่อย Dataset JSON-LD ให้ search engine หรือไม่
   */
  status: "sample" | "live";
  updatedAt: string;
  /** ไม่มี = ยังไม่เคยรัน pipeline (ชุด seed ที่เขียนมือ) */
  provenance?: Provenance;
  benchmarkMeta: BenchmarkMeta[];
  sources: DataSource[];
  models: Model[];
};

export type NewsDataset = {
  status: "sample" | "live";
  updatedAt: string;
  items: NewsItem[];
};
