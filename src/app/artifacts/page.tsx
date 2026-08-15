import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import SectionTitle from "@/components/SectionTitle";
import { BreadcrumbJsonLd, WebPageJsonLd } from "@/components/JsonLd";
import { SITE_NAME } from "@/lib/site";
import {
  benchmarkMeta,
  formatDate,
  modelDataset,
  models,
  newsDataset,
} from "@/lib/artifacts/data";

const PATH = "/artifacts";
const TITLE = "Artifacts | 9Expert Training";
const DESC =
  "เครื่องมือและแดชบอร์ดเชิงโต้ตอบด้าน AI โดย 9Expert Training — เปรียบเทียบโมเดล AI ข่าวสารวงการ และข้อมูลที่อัปเดตอัตโนมัติทุกวัน";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  keywords: [
    "AI dashboard",
    "เครื่องมือ AI",
    "เปรียบเทียบ AI Model",
    "9Expert Training",
  ],
  alternates: { canonical: PATH },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: PATH,
    siteName: SITE_NAME,
    type: "website",
    locale: "th_TH",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
};

const artifacts = [
  {
    href: "/artifacts/ai-models",
    eyebrow: "AI Model Intelligence",
    title: "เปรียบเทียบโมเดล AI",
    description:
      "เลือกโมเดลที่สนใจแล้วเทียบคะแนน benchmark ราคา ความเร็ว และฟีเจอร์แบบเคียงข้างกัน พร้อมส่วนข่าวสารวงการ AI",
    live: true,
    facts: [
      `${models.length} โมเดล`,
      `${benchmarkMeta.length} benchmark`,
      `${newsDataset.items.length} ข่าว`,
    ],
  },
];

export default function ArtifactsPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "หน้าแรก", path: "/" },
          { name: "Artifacts", path: PATH },
        ]}
      />
      <WebPageJsonLd
        name={TITLE}
        description={DESC}
        path={PATH}
        dateModified={modelDataset.updatedAt}
      />

      <Navbar basePath="/" />

      <main className="relative pt-32 pb-24 min-h-screen">
        <div className="absolute inset-0 bg-deep-navy -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(0,92,255,0.15)_0%,transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(255,176,32,0.07)_0%,transparent_45%)]" />
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle
            subtitle="Artifacts"
            title="เครื่องมือและแดชบอร์ดที่ใช้งานได้จริง"
            align="left"
          />

          <p className="text-lg text-gray-400 max-w-2xl -mt-10 mb-14 leading-relaxed">
            หน้ารวมเครื่องมือเชิงโต้ตอบด้าน AI ของ 9Expert Training เปิดให้ใช้ฟรี
            ข้อมูลอัปเดตอัตโนมัติ ไม่ใช่ภาพนิ่งหรือสไลด์ที่ค้างอยู่กับที่
          </p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {artifacts.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative rounded-3xl bg-white/[0.03] border border-white/[0.06] p-7 hover:border-blue-primary/30 transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-amber-accent animate-pulse" />
                  <span className="text-xs text-amber-accent font-bold tracking-widest uppercase">
                    {item.eyebrow}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-light transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-400 leading-relaxed flex-1">
                  {item.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-6">
                  {item.facts.map((f) => (
                    <span
                      key={f}
                      className="px-3 py-1 rounded-full bg-blue-primary/10 border border-blue-primary/20 text-xs text-blue-light"
                    >
                      {f}
                    </span>
                  ))}
                </div>

                <span className="inline-flex items-center gap-2 text-sm text-white font-medium mt-6">
                  เปิดดู
                  <svg
                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
              </Link>
            ))}

            {/* ช่องว่างสำหรับ artifact ถัดไป — บอกตรง ๆ ว่ายังไม่มี ดีกว่าใส่การ์ดปลอม */}
            <div className="rounded-3xl border border-dashed border-white/[0.08] p-7 flex flex-col items-center justify-center text-center min-h-[220px]">
              <span className="text-3xl mb-3 opacity-40">✦</span>
              <p className="text-gray-500 text-sm leading-relaxed">
                กำลังเตรียม artifact ตัวถัดไป
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-500 mt-12">
            ข้อมูลชุดล่าสุดเมื่อ {formatDate(modelDataset.updatedAt)}
          </p>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
