import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "9Expert Training — AI, Cloud & Digital Transformation";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** ใช้กับหน้าแรกและทุกหน้าที่ไม่ได้ override og:image ของตัวเอง */
export default async function Image() {
  return renderOgImage({
    eyebrow: "9Expert Training",
    title: "AI, Cloud & Digital Transformation",
    subtitle:
      "อบรมและให้คำปรึกษาด้าน Data, AI และ Automation สำหรับองค์กร โดยทีมผู้เชี่ยวชาญ",
  });
}
