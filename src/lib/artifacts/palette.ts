import type { VendorLogoKey } from "./vendor-logos";

/**
 * สีและโลโก้ประจำโมเดล — ผูกกับ "ค่ายผู้พัฒนา" ไม่ใช่ลำดับที่ผู้ใช้เลือก
 *
 * แนวคิด: ผู้อ่านจำ "Claude = ส้ม, GPT = ขาว-ดำ, Gemini = เขียว" ได้ทันทีโดย
 * ไม่ต้องมองคำอธิบายสี ตระกูลเดียวกันใช้สีเดียวกันไล่เฉด (Fable → Opus → Sonnet
 * อ่อนไปเข้ม) เพื่อให้เห็นว่าเป็นค่ายเดียวกันแต่คนละรุ่น
 *
 * ── ข้อแลกเปลี่ยนที่ต้องรู้ ──────────────────────────────────────────────
 * สีแบรนด์จริงไม่ผ่านเกณฑ์ palette เชิงนามธรรมสำหรับแยกชุดข้อมูล และไม่มีทางผ่าน
 * เพราะสีถูกกำหนดโดยแบรนด์ ไม่ได้เลือกให้ห่างกัน คู่ที่ใกล้ที่สุดคือ
 * (วัดด้วย normal-vision ΔE บนพื้น #142230 · เกณฑ์อ้างอิงคือ >= 15)
 *
 *   Fable ↔ Opus    11.1   ← ตั้งใจ เป็นตระกูล Claude เหมือนกัน
 *   Opus  ↔ Sonnet  12.3   ← ตั้งใจ เป็นตระกูล Claude เหมือนกัน
 *   Grok  ↔ GLM     13.9
 *   Grok  ↔ Qwen3.5 14.0
 *
 * จึงบังคับว่า "ทุก mark ต้องมีโลโก้ + ชื่อรุ่นกำกับเสมอ" — สีเป็นตัวช่วยจำ
 * ไม่ใช่ช่องทางเดียวที่บอกว่าแท่งไหนคือโมเดลไหน ถ้าจะเอาป้ายชื่อออกจากกราฟ
 * ต้องกลับไปใช้ palette ที่ผ่านเกณฑ์แทน
 *
 * สิ่งที่ยังบังคับอยู่: ทุกสีต้องผ่าน contrast >= 3:1 บนพื้นการ์ด #142230
 * (ต่ำสุดคือ Sonnet 3.13:1) — นี่คือเหตุผลที่ GPT/Grok/Kimi ซึ่งแบรนด์เป็นสีดำ
 * ถูกกลับเป็นโทนสว่างบนพื้นเข้ม แบบเดียวกับที่โลโก้กลับสีบนพื้นมืด
 */

export type ModelBrand = {
  color: string;
  logo: VendorLogoKey;
  /** ชื่อค่ายแบบสั้นสำหรับ tooltip/aria */
  vendorLabel: string;
};

export const MODEL_BRANDS: Record<string, ModelBrand> = {
  // Anthropic — ดินเผา ไล่อ่อนไปเข้มตามรุ่น
  "claude-fable-5": {
    color: "#F0A181",
    logo: "anthropic",
    vendorLabel: "Anthropic",
  },
  "claude-opus-5": {
    color: "#D97757", // สีทางการของ Claude
    logo: "anthropic",
    vendorLabel: "Anthropic",
  },
  "claude-sonnet-5": {
    color: "#AF5232",
    logo: "anthropic",
    vendorLabel: "Anthropic",
  },
  // OpenAI — แบรนด์เป็นขาว-ดำ บนพื้นเข้มจึงใช้โทนขาว
  "gpt-5-6-sol": { color: "#ECECEA", logo: "openai", vendorLabel: "OpenAI" },
  // Google — เขียว
  "gemini-3-1-pro": {
    color: "#41BF6B",
    logo: "gemini",
    vendorLabel: "Google DeepMind",
  },
  // Moonshot — แบรนด์ขาว-ดำ ใช้เทาเข้มกว่า GPT เพื่อไม่ให้ชนกัน
  "kimi-k3": { color: "#63707F", logo: "moonshot", vendorLabel: "Moonshot AI" },
  // xAI — แบรนด์ขาว-ดำ ใช้เทากลาง
  "grok-5": { color: "#93A2B2", logo: "xai", vendorLabel: "xAI" },
  // Z.ai / Zhipu — น้ำเงิน
  "glm-5": { color: "#2E9BF5", logo: "zai", vendorLabel: "Z.ai" },
  // Alibaba Qwen — ม่วง ไล่เข้มไปอ่อนตามรุ่น
  "qwen3-7-max": { color: "#9366F0", logo: "qwen", vendorLabel: "Alibaba" },
  "qwen3-5": { color: "#C9A5FF", logo: "qwen", vendorLabel: "Alibaba" },
};

/** ใช้เมื่อเจอ id ที่ยังไม่มีในตาราง (เช่น pipeline เพิ่มโมเดลใหม่) */
const FALLBACK: ModelBrand = {
  color: "#8FA0B3",
  logo: "openai",
  vendorLabel: "",
};

export function brandForModel(modelId: string): ModelBrand {
  return MODEL_BRANDS[modelId] ?? FALLBACK;
}

export function colorForModel(modelId: string): string {
  return brandForModel(modelId).color;
}

/**
 * เลือกได้ทุกโมเดลพร้อมกัน — สีผูกกับค่ายอยู่แล้วจึงไม่มีเพดานจากจำนวนสี
 * ตัวจำกัดที่เหลือคือความกว้างของตาราง ซึ่งแก้ด้วยการเลื่อนแนวนอนได้
 */
export const MAX_SELECTED = 10;

/** chart chrome — hairline เดียวกันทั้งชุด */
export const CHROME = {
  grid: "rgba(255,255,255,0.06)",
  axis: "rgba(255,255,255,0.14)",
  mutedInk: "#94A3B8",
  secondaryInk: "#CBD5E1",
  surface: "#142230",
} as const;
