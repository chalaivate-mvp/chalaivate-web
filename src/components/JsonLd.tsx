import { ORG, SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";
import type { BenchmarkMeta, Model } from "@/lib/artifacts/types";

/**
 * Structured data (JSON-LD) สำหรับ search engine
 *
 * แนวทาง: ประกาศเฉพาะสิ่งที่เป็นความจริงและมองเห็นได้บนหน้าเว็บจริง
 * ตามแนวปฏิบัติของ Google — ห้าม markup ข้อมูลที่ผู้ใช้มองไม่เห็น
 *
 * `dangerouslySetInnerHTML` เป็นวิธีมาตรฐานของการฝัง JSON-LD ใน React
 * ปลอดภัยตรงนี้เพราะข้อมูลมาจากไฟล์ในโปรเจกต์เอง ไม่ใช่ input ของผู้ใช้
 * และยัง escape `<` กัน `</script>` ในข้อความหลุดออกไปปิด tag ก่อนเวลา
 */
function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

const ORG_ID = absoluteUrl("/#organization");
const SITE_ID = absoluteUrl("/#website");

export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        "@id": ORG_ID,
        name: SITE_NAME,
        url: SITE_URL,
        description: ORG.description,
        logo: {
          "@type": "ImageObject",
          url: absoluteUrl("/images/9expert-logo.png"),
        },
        // เว็บหลักของสถาบัน — บอก Google ว่าสองโดเมนนี้เป็นองค์กรเดียวกัน
        sameAs: [ORG.mainSite],
      }}
    />
  );
}

export function WebSiteJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": SITE_ID,
        name: SITE_NAME,
        url: SITE_URL,
        inLanguage: "th-TH",
        publisher: { "@id": ORG_ID },
      }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; path: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          item: absoluteUrl(item.path),
        })),
      }}
    />
  );
}

export function WebPageJsonLd({
  name,
  description,
  path,
  dateModified,
}: {
  name: string;
  description: string;
  path: string;
  dateModified: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": absoluteUrl(path),
        url: absoluteUrl(path),
        name,
        description,
        dateModified,
        inLanguage: "th-TH",
        isPartOf: { "@id": SITE_ID },
        publisher: { "@id": ORG_ID },
      }}
    />
  );
}

/**
 * Dataset + ItemList ของโมเดล
 *
 * ⚠ เรียกได้ต่อเมื่อชุดข้อมูลเป็น status "live" เท่านั้น
 *
 * การประกาศ Dataset คือการบอก Google ว่า "นี่คือชุดข้อมูลจริง อ้างอิงได้"
 * และอาจถูกดึงไปแสดงเป็น rich result — ถ้าตัวเลขยังเป็นข้อมูลตัวอย่างที่ยัง
 * ไม่ verify การใส่ markup นี้เท่ากับรับรองข้อมูลที่ยังไม่จริง
 * ตัวเรียกใน page.tsx จึงต้องเช็ค modelDataset.status ก่อนเสมอ
 */
export function ModelDatasetJsonLd({
  path,
  models,
  benchmarks,
  dateModified,
  sources,
}: {
  path: string;
  models: Model[];
  benchmarks: BenchmarkMeta[];
  dateModified: string;
  sources: { name: string; url: string }[];
}) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Dataset",
          name: "เปรียบเทียบ benchmark โมเดล Generative AI",
          description:
            "ชุดข้อมูลเปรียบเทียบคะแนน benchmark ราคา ความเร็ว และความสามารถของโมเดล Generative AI ล่าสุด",
          url: absoluteUrl(path),
          dateModified,
          inLanguage: "th-TH",
          creator: { "@id": ORG_ID },
          isAccessibleForFree: true,
          variableMeasured: [
            ...benchmarks.map((b) => ({
              "@type": "PropertyValue",
              name: b.label,
              description: b.description,
              unitText: "PERCENT",
            })),
            {
              "@type": "PropertyValue",
              name: "Context window",
              unitText: "tokens",
            },
            {
              "@type": "PropertyValue",
              name: "ราคา API",
              unitText: "USD ต่อ 1M tokens",
            },
            {
              "@type": "PropertyValue",
              name: "Output speed",
              unitText: "tokens ต่อวินาที",
            },
          ],
          citation: sources.map((s) => s.url),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "โมเดล Generative AI ที่นำมาเปรียบเทียบ",
          numberOfItems: models.length,
          itemListElement: models.map((m, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "SoftwareApplication",
              name: m.name,
              applicationCategory: "Generative AI model",
              operatingSystem: "Web-based API",
              author: { "@type": "Organization", name: m.vendor },
              ...(m.releaseDate ? { datePublished: m.releaseDate } : {}),
            },
          })),
        }}
      />
    </>
  );
}
