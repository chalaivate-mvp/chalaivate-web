/**
 * ค่าคงที่ระดับเว็บไซต์ — แหล่งความจริงเดียวของ URL และชื่อแบรนด์
 *
 * ทุกอย่างที่ต้องใช้ absolute URL (canonical, OG, sitemap, JSON-LD) อ่านจากที่นี่
 * ถ้าย้าย domain ให้แก้ที่ SITE_URL ที่เดียว
 */
export const SITE_URL = "https://www.chalaivate.com";

export const SITE_NAME = "9Expert Training";

export const ORG = {
  name: SITE_NAME,
  /** เว็บหลักของสถาบัน — คนละตัวกับเว็บนี้ */
  mainSite: "https://www.9experttraining.com",
  tagline: "อบรม Data AI Automation ผู้เรียน 90,000+",
  description:
    "9Expert Training สถาบันฝึกอบรมด้าน Data, AI และ Automation ผ่านผู้เรียนมากกว่า 90,000 คน",
} as const;

/** สร้าง absolute URL จาก path — ใช้กับ JSON-LD ที่ metadataBase ช่วยไม่ได้ */
export function absoluteUrl(path = "/"): string {
  return new URL(path, SITE_URL).toString();
}
