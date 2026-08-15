import modelsJson from "@/data/ai-models.json";
import newsJson from "@/data/ai-news.json";
import type {
  BenchmarkKey,
  Model,
  ModelDataset,
  NewsDataset,
} from "./types";

/**
 * จุดเดียวที่ JSON ดิบถูกแปลงเป็น type ของแอป
 *
 * Phase 2: script ที่ดึงข้อมูลจะ validate ด้วย zod ก่อนเขียนไฟล์ ดังนั้นการ cast
 * ตรงนี้จึงปลอดภัย — ถ้าเปลี่ยน shape ให้แก้ทั้ง types.ts และ script พร้อมกัน
 */
export const modelDataset = modelsJson as ModelDataset;
export const newsDataset = newsJson as NewsDataset;

export const models = modelDataset.models;
export const benchmarkMeta = modelDataset.benchmarkMeta;

export function getModel(id: string): Model | undefined {
  return models.find((m) => m.id === id);
}

/** ค่าที่ดีที่สุดของ benchmark หนึ่ง ๆ ใช้ scale แกนกราฟ */
export function benchmarkMax(key: BenchmarkKey): number {
  const values = models
    .map((m) => m.benchmarks[key])
    .filter((v): v is number => v !== null);
  return values.length ? Math.max(...values) : 100;
}

/** ราคาเฉลี่ยถ่วงน้ำหนัก 3:1 (input:output) — ประมาณการใช้งานจริงแบบ chat */
export function blendedPrice(model: Model): number | null {
  const { input, output } = model.pricing;
  if (input === null || output === null) return null;
  return (input * 3 + output) / 4;
}

export const numberFormat = new Intl.NumberFormat("th-TH");

export function formatTokens(n: number | null): string {
  if (n === null) return "N/A";
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return `${Number.isInteger(m) ? m : m.toFixed(2)}M`;
  }
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return numberFormat.format(n);
}

export function formatDate(iso: string | null): string {
  if (!iso) return "N/A";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
