import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { modelDataset } from "@/lib/artifacts/data";

/**
 * sitemap.xml — Next สร้างให้อัตโนมัติจากไฟล์นี้
 *
 * lastModified ของหน้าเปรียบเทียบดึงจาก updatedAt ของชุดข้อมูล ไม่ใช่วันที่ build
 * เพื่อให้ครอว์เลอร์รู้จริง ๆ ว่าเนื้อหาเปลี่ยนเมื่อไหร่ — พอต่อ pipeline เฟส 2
 * ค่านี้จะขยับเองทุกวันโดยไม่ต้องแก้โค้ด
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const dataUpdatedAt = new Date(modelDataset.updatedAt);

  return [
    {
      url: SITE_URL,
      lastModified: dataUpdatedAt,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/artifacts`,
      lastModified: dataUpdatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/artifacts/ai-models`,
      lastModified: dataUpdatedAt,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];
}
