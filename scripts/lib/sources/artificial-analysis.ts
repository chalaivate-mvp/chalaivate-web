import { AaResponse } from "../schema";
import { fetchJson, HttpError, type FetchLike } from "../http";

const ENDPOINT = "https://artificialanalysis.ai/api/v2/data/llms/models";

/**
 * ชื่อ field ย่อยใน `evaluations` ยังยืนยันจากเอกสารสาธารณะไม่ได้ และผู้ให้บริการ
 * เปลี่ยนชื่อได้ตามรอบ benchmark (เช่น aime → aime_2026) จึงไม่ hardcode ชื่อเดียว
 * แต่ไล่หาจากรายการชื่อที่เป็นไปได้ ตัวไหนเจอก่อนใช้ตัวนั้น
 *
 * รอบแรกที่รันจริงให้ดู mapping report ที่ script พิมพ์ออกมา ถ้าตัวไหนขึ้น "ไม่พบ"
 * ให้เอาชื่อจริงจาก log มาเติมในรายการนี้ — ไม่ต้องแก้ logic
 */
const EVAL_ALIASES: Record<string, string[]> = {
  mmlu: ["mmlu_pro", "mmlu", "mmlu_redux"],
  gpqa: ["gpqa_diamond", "gpqa"],
  // SWE-bench ถูกถอดออกจาก catalog แล้ว เพราะ API ไม่ส่ง field นี้มาเลยสักชื่อ
  // (ไม่ได้มาแบบ null ด้วยซ้ำ) เก็บ alias ไว้เฉย ๆ มีแต่ทำให้รายงานขึ้น "ไม่พบ" ทุกรอบ
  aime: ["aime_2026", "aime_2025", "aime_2024", "aime"],
  hle: ["humanitys_last_exam", "humanity_last_exam", "hle"],
};

const INDEX_ALIASES: Record<string, string[]> = {
  intelligence: [
    "artificial_analysis_intelligence_index",
    "intelligence_index",
    "aa_intelligence_index",
  ],
  coding: [
    "artificial_analysis_coding_index",
    "coding_index",
    "aa_coding_index",
  ],
  agentic: [
    "artificial_analysis_agentic_index",
    "agentic_index",
    "aa_agentic_index",
  ],
};

export type AaMetrics = {
  benchmarks: Record<string, number | null>;
  indices: {
    intelligence: number | null;
    coding: number | null;
    agentic: number | null;
  };
  speed: { tokensPerSecond: number | null; firstTokenSeconds: number | null };
  /**
   * ชื่อ field ที่ "โมเดลตัวนี้" มีค่าจริง
   *
   * ต่างจาก availableFields ที่รวมทั้ง 1792 รายการ — benchmark บางตัวมีในคลังแต่
   * ไม่ได้วัดกับโมเดลที่เราเลือก การรู้ว่าโมเดลของเรามีอะไรบ้างจึงเป็นคนละคำถาม
   */
  presentFields: string[];
};

export type AaResult = {
  byKey: Map<string, AaMetrics>;
  /** ชื่อ field ที่ match ได้จริง สำหรับพิมพ์รายงาน */
  matchedFields: Record<string, string | null>;
  /**
   * ชื่อ field ทั้งหมดที่ API ส่งมาจริง แยกสองกอง
   *
   * ผู้ให้บริการประกาศว่า "เลิกใช้ field ไหนจะปล่อยให้เป็น null ไม่เปลี่ยนชื่อ"
   * การแยก withValues ออกจาก allNull จึงบอกได้ว่า field ที่จับคู่ไม่ได้นั้น
   * "ไม่มีอยู่จริง" (ต้องหาชื่อใหม่) หรือ "มีแต่เขาเลิกวัดแล้ว" (ต้องถอดออกจาก catalog)
   * — เป็นคนละปัญหาที่แก้คนละแบบ
   */
  availableFields: { withValues: string[]; allNull: string[] };
};

/**
 * คะแนน benchmark บาง endpoint ส่งมาเป็นสัดส่วน 0–1 บางที่เป็น 0–100
 * ถ้าไม่แปลงให้เป็นสเกลเดียว กราฟจะเห็นแท่งจิ๋วติดพื้นโดยไม่มีใครสังเกต
 */
function toPercent(value: number | null): number | null {
  if (value === null) return null;
  if (value < 0) return null;
  const scaled = value <= 1 ? value * 100 : value;
  return scaled > 100 ? null : Number(scaled.toFixed(1));
}

function pickAlias(
  bag: Record<string, number | null> | null | undefined,
  aliases: string[],
): { value: number | null; key: string | null } {
  if (!bag) return { value: null, key: null };
  // เทียบแบบไม่สนตัวพิมพ์และขีดล่าง เผื่อ API เปลี่ยนเป็น camelCase
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const table = new Map(Object.keys(bag).map((k) => [norm(k), k]));
  for (const alias of aliases) {
    const real = table.get(norm(alias));
    if (real !== undefined && bag[real] !== null && bag[real] !== undefined) {
      return { value: bag[real], key: real };
    }
  }
  return { value: null, key: null };
}

export async function fetchArtificialAnalysis(
  apiKey: string,
  fetchImpl?: FetchLike,
): Promise<AaResult> {
  if (!apiKey) {
    throw new HttpError("ไม่ได้ตั้ง ARTIFICIAL_ANALYSIS_API_KEY");
  }

  const raw = await fetchJson(ENDPOINT, {
    headers: { "x-api-key": apiKey },
    fetchImpl,
  });
  const parsed = AaResponse.parse(raw);

  const byKey = new Map<string, AaMetrics>();
  const matchedFields: Record<string, string | null> = {};
  const keysSeen = new Set<string>();
  const keysWithValue = new Set<string>();

  for (const m of parsed.data) {
    // top-level กับ evaluations อาจเก็บ index คนละที่ รวมสองที่แล้วค่อยไล่หา
    const topLevelNumbers = Object.entries(m).filter(
      (entry): entry is [string, number] => typeof entry[1] === "number",
    );
    const bag: Record<string, number | null> = {
      ...(m.evaluations ?? {}),
      ...Object.fromEntries(topLevelNumbers),
    };

    for (const [k, v] of Object.entries(bag)) {
      keysSeen.add(k);
      if (v !== null && v !== undefined) keysWithValue.add(k);
    }

    const benchmarks: Record<string, number | null> = {};
    for (const [key, aliases] of Object.entries(EVAL_ALIASES)) {
      const hit = pickAlias(bag, aliases);
      benchmarks[key] = toPercent(hit.value);
      if (hit.key && !matchedFields[key]) matchedFields[key] = hit.key;
      else if (!(key in matchedFields)) matchedFields[key] = null;
    }

    const indices = {} as AaMetrics["indices"];
    for (const [key, aliases] of Object.entries(INDEX_ALIASES)) {
      const hit = pickAlias(bag, aliases);
      indices[key as keyof AaMetrics["indices"]] = toPercent(hit.value);
      if (hit.key && !matchedFields[key]) matchedFields[key] = hit.key;
      else if (!(key in matchedFields)) matchedFields[key] = null;
    }

    const metrics: AaMetrics = {
      benchmarks,
      indices,
      presentFields: Object.entries(bag)
        .filter(([, v]) => v !== null && v !== undefined)
        .map(([k]) => k)
        .sort(),
      speed: {
        tokensPerSecond: m.median_output_tokens_per_second,
        firstTokenSeconds: m.median_time_to_first_token_seconds,
      },
    };

    // ลง index ทุกชื่อที่เป็นไปได้ เพื่อให้ catalog อ้างด้วย slug หรือ id ก็เจอ
    for (const alias of [m.slug, m.id, m.name]) {
      if (alias) byKey.set(alias.toLowerCase(), metrics);
    }
  }

  const withValues = [...keysWithValue].sort();
  const allNull = [...keysSeen].filter((k) => !keysWithValue.has(k)).sort();

  return { byKey, matchedFields, availableFields: { withValues, allNull } };
}

export function lookupAa(
  result: AaResult,
  key: string | null,
): AaMetrics | null {
  if (!key) return null;
  return result.byKey.get(key.toLowerCase()) ?? null;
}
