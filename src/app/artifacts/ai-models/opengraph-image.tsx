import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";
import { benchmarkMeta, models } from "@/lib/artifacts/data";

export const alt = "เปรียบเทียบ AI Model ล่าสุด | 9Expert Training";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOgImage({
    eyebrow: "AI Model Intelligence",
    title: "เปรียบเทียบ AI Model ล่าสุด",
    subtitle: `${models.length} โมเดล · ${benchmarkMeta.length} benchmark · ราคา ความเร็ว และฟีเจอร์ เทียบกันแบบเคียงข้าง`,
  });
}
