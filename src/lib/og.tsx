import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ORG, SITE_NAME } from "./site";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/**
 * ฟอนต์สำหรับ og:image
 *
 * ต้อง self-host เป็น .woff ในโปรเจกต์ เพราะ:
 *   1. satori (ตัว render เบื้องหลัง ImageResponse) อ่าน .woff2 ไม่ได้
 *   2. ฟอนต์ default ของ ImageResponse ไม่มี glyph ภาษาไทย ตัวอักษรจะกลายเป็นสี่เหลี่ยม
 *   3. ถ้าไปโหลดจาก Google Fonts ตอน build เว็บจะพังทันทีที่ network มีปัญหา
 * แยก subset ไทย/ละติน เพราะรวมกันแล้วไฟล์ใหญ่โดยไม่จำเป็น satori จะเลือกให้เองต่อ glyph
 */
async function loadFonts() {
  const dir = join(process.cwd(), "src/assets/fonts");
  const [thai700, latin700, thai400, latin400] = await Promise.all([
    readFile(join(dir, "NotoSansThai-thai-700.woff")),
    readFile(join(dir, "NotoSansThai-latin-700.woff")),
    readFile(join(dir, "NotoSansThai-thai-400.woff")),
    readFile(join(dir, "NotoSansThai-latin-400.woff")),
  ]);
  return [
    { name: "NotoThai", data: thai700, weight: 700 as const, style: "normal" as const },
    { name: "NotoLatin", data: latin700, weight: 700 as const, style: "normal" as const },
    { name: "NotoThai", data: thai400, weight: 400 as const, style: "normal" as const },
    { name: "NotoLatin", data: latin400, weight: 400 as const, style: "normal" as const },
  ];
}

const NAVY = "#0D1B2A";
const BLUE = "#005CFF";
const BLUE_LIGHT = "#3D85FF";
const LIME = "#D4F73F";

/**
 * การ์ด OG มาตรฐานของเว็บ — ใช้สีและโครงเดียวกับหน้าเว็บจริง
 * satori รองรับ CSS แค่ชุดย่อย: ทุก element ที่มีลูกหลายตัวต้องระบุ display:flex เอง
 */
export async function renderOgImage({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  const fonts = await loadFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: NAVY,
          backgroundImage: `radial-gradient(ellipse 90% 70% at 12% 0%, rgba(0,92,255,0.35) 0%, transparent 60%), radial-gradient(ellipse 70% 60% at 95% 15%, rgba(72,176,255,0.20) 0%, transparent 55%)`,
          padding: "72px 80px",
          fontFamily: "NotoLatin, NotoThai",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: LIME,
              display: "flex",
            }}
          />
          <div
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: LIME,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            {eyebrow}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 78,
              fontWeight: 700,
              color: "#FFFFFF",
              lineHeight: 1.18,
              maxWidth: 960,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 400,
              color: "#94A3B8",
              lineHeight: 1.45,
              maxWidth: 900,
            }}
          >
            {subtitle}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "2px solid rgba(255,255,255,0.10)",
            paddingTop: 32,
          }}
        >
          {/* "9" สีน้ำเงินติดกับคำว่า Expert Training ต้องไม่มีช่องว่างคั่น */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 0 }}>
            <div style={{ fontSize: 40, fontWeight: 700, color: BLUE_LIGHT }}>
              9
            </div>
            <div style={{ fontSize: 36, fontWeight: 700, color: "#FFFFFF" }}>
              {SITE_NAME.slice(1)}
            </div>
          </div>
          <div style={{ fontSize: 24, color: "#64748B" }}>{ORG.tagline}</div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            width: "100%",
            height: 8,
            display: "flex",
            background: `linear-gradient(90deg, ${BLUE} 0%, ${BLUE_LIGHT} 50%, ${LIME} 100%)`,
          }}
        />
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}
