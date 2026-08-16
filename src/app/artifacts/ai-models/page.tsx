import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import ModelExplorer from "@/components/artifacts/ModelExplorer";
import {
  BreadcrumbJsonLd,
  ModelDatasetJsonLd,
  WebPageJsonLd,
} from "@/components/JsonLd";
import { SITE_NAME } from "@/lib/site";
import {
  benchmarkMeta,
  formatDate,
  modelDataset,
  models,
  newsDataset,
} from "@/lib/artifacts/data";

const PATH = "/artifacts/ai-models";
const TITLE = "เปรียบเทียบ AI Model ล่าสุด | 9Expert Training";
const DESC =
  "เปรียบเทียบความสามารถของโมเดล Generative AI ล่าสุด ทั้งคะแนน benchmark ราคา ความเร็ว และฟีเจอร์ เลือกโมเดลที่สนใจมาเทียบกันได้เอง พร้อมข่าวสารวงการ AI อัปเดตทุกวัน";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  keywords: [
    "เปรียบเทียบ AI Model",
    "เปรียบเทียบ AI",
    "LLM comparison",
    "AI benchmark",
    "Claude",
    "GPT",
    "Gemini",
    "Qwen",
    "AI ภาษาไทย",
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

/**
 * ข้อมูลมาจาก JSON ที่ commit อยู่ใน repo — หน้านี้จึงเป็น static ล้วน
 * revalidate ไว้เผื่อกรณีอยาก refresh โดยไม่ redeploy ในอนาคต
 */
export const revalidate = 3600;

export default function AiModelsPage() {
  const isSample = modelDataset.status === "sample";

  /* แบนเนอร์เตือนต้องบอกตัวเลขจริง ไม่ใช่ข้อความตายตัว
     ตอนยังไม่มี pipeline ข้อความเดิมบอกว่า "ทุกตัวเลขยังไม่ยืนยัน" ซึ่งพอต่อ API
     แล้วกลายเป็นคำพูดที่ผิดยิ่งกว่าไม่มีแบนเนอร์ เพราะทำให้คนไม่เชื่อข้อมูลที่จริง
     อ่านจาก provenance ทุกครั้งจึงล้าสมัยไม่ได้ */
  const filled = modelDataset.provenance?.filled;
  const missingSlots = filled ? filled.expected - filled.actual : null;
  /* ต้องใช้ provenance.ok ไม่ใช่ sources — sources คือรายการ attribution ที่คนเขียนไว้
     ซึ่งมีแหล่งที่ pipeline ไม่ได้ดึงตัวเลขมาด้วย ถ้าเอามาอ้างจะกลายเป็นเครดิตเกินจริง */
  const fetched = modelDataset.provenance?.ok ?? [];
  const sourceNames =
    fetched.length > 1
      ? `${fetched.slice(0, -1).join(", ")} และ ${fetched.at(-1)}`
      : (fetched[0] ?? "");

  const stats = [
    { value: String(models.length), label: "โมเดล" },
    { value: String(benchmarkMeta.length), label: "Benchmark" },
    { value: String(newsDataset.items.length), label: "ข่าวล่าสุด" },
    { value: formatDate(modelDataset.updatedAt), label: "อัปเดตล่าสุด" },
  ];

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "หน้าแรก", path: "/" },
          { name: "Artifacts", path: "/artifacts" },
          { name: "เปรียบเทียบ AI Model", path: PATH },
        ]}
      />
      <WebPageJsonLd
        name={TITLE}
        description={DESC}
        path={PATH}
        dateModified={modelDataset.updatedAt}
      />
      {/* Dataset/ItemList ออกเฉพาะตอนข้อมูลเป็น live — ดูเหตุผลใน JsonLd.tsx */}
      {!isSample && (
        <ModelDatasetJsonLd
          path={PATH}
          models={models}
          benchmarks={benchmarkMeta}
          dateModified={modelDataset.updatedAt}
          sources={modelDataset.sources}
        />
      )}

      <Navbar basePath="/" />

      <main className="relative pt-28 pb-24">
        <div className="absolute inset-0 bg-deep-navy -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_0%,rgba(0,92,255,0.14)_0%,transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_10%,rgba(255,176,32,0.07)_0%,transparent_45%)]" />
        </div>

        <div className="max-w-7xl mx-auto px-6">
          {/* ── HERO ── */}
          <header className="mb-10">
            <a
              href="/artifacts"
              className="flex w-fit items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-6"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16l-4-4m0 0l4-4m-4 4h18"
                />
              </svg>
              กลับไปหน้า Artifacts
            </a>

            <span className="inline-block text-amber-accent text-sm font-bold tracking-widest uppercase mb-3">
              AI Model Intelligence
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight max-w-3xl">
              เปรียบเทียบศักยภาพ
              <span className="bg-gradient-to-r from-blue-primary via-blue-light to-amber-accent bg-clip-text text-transparent">
                {" "}
                โมเดล AI
              </span>
            </h1>
            <p className="text-lg text-gray-400 mt-4 max-w-2xl leading-relaxed">
              เลือกโมเดลที่สนใจแล้วดูคะแนน benchmark ราคา ความเร็ว
              และฟีเจอร์เทียบกันแบบตรง ๆ พร้อมข่าวสารวงการ AI ที่อัปเดตทุกวัน
            </p>

            <div className="mt-4 h-1 w-16 bg-gradient-to-r from-blue-primary to-amber-accent rounded-full" />

            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 max-w-3xl">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl bg-white/[0.03] border border-white/[0.06] px-4 py-3"
                >
                  <dd className="text-xl font-bold text-white">{s.value}</dd>
                  <dt className="text-xs text-gray-500 mt-0.5">{s.label}</dt>
                </div>
              ))}
            </dl>
          </header>

          {/* ── คำเตือนข้อมูลตัวอย่าง ── */}
          {isSample && (
            <div className="rounded-2xl border border-amber-accent/30 bg-amber-accent/[0.07] p-5 mb-10 flex gap-4">
              <svg
                className="w-6 h-6 text-amber-accent shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div>
                <p className="text-amber-accent font-bold mb-1">
                  ข้อมูลยังไม่ครบทุกช่อง
                </p>
                <p className="text-sm text-gray-300 leading-relaxed">
                  ตัวเลขที่แสดงดึงจาก{sourceNames ? ` ${sourceNames} ` : " "}
                  โดยตรงและ<strong className="text-white">ไม่มีการเดาค่า</strong>
                  {filled
                    ? ` แต่รอบล่าสุดได้ข้อมูล ${filled.actual} จาก ${filled.expected} ช่อง`
                    : " แต่ยังได้ข้อมูลไม่ครบทุกช่อง"}
                  {missingSlots
                    ? ` — อีก ${missingSlots} ช่องที่แหล่งข้อมูลยังไม่ได้วัดจะแสดงเป็น N/A ไม่ใช่ตัวเลขประมาณ`
                    : " ช่องที่ยังไม่มีข้อมูลจะแสดงเป็น N/A"}{" "}
                  แถบนี้จะหายไปเองเมื่อข้อมูลครบทุกช่อง
                </p>
              </div>
            </div>
          )}

          {/* ── ส่วนโต้ตอบ ──
              useSearchParams ต้องอยู่ใต้ Suspense ไม่งั้น Next 16 จะ
              บังคับให้ทั้งหน้ากลายเป็น dynamic rendering */}
          <Suspense
            fallback={
              <div className="rounded-3xl bg-white/[0.03] border border-white/[0.06] h-40 animate-pulse" />
            }
          >
            <ModelExplorer models={models} news={newsDataset.items} />
          </Suspense>

          {/* ── แหล่งข้อมูล ── */}
          <section className="mt-16 pt-8 border-t border-white/[0.06]">
            <h3 className="text-sm font-bold tracking-widest uppercase text-amber-accent mb-4">
              แหล่งข้อมูล
            </h3>
            <ul className="grid gap-3 sm:grid-cols-3">
              {modelDataset.sources.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 hover:border-blue-primary/30 transition-colors"
                  >
                    <span className="block text-white text-sm font-medium">
                      {s.name}
                    </span>
                    {s.attribution && (
                      <span className="block text-xs text-gray-500 mt-1">
                        {s.attribution}
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
            <p className="text-xs text-gray-600 mt-4 leading-relaxed">
              โลโก้ของแต่ละค่ายเป็นเครื่องหมายการค้าของเจ้าของแบรนด์
              ใช้เพื่อระบุผลิตภัณฑ์ในตารางเปรียบเทียบเท่านั้น · รูปทรงโลโก้จาก{" "}
              <a
                href="https://github.com/lobehub/lobe-icons"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-gray-400"
              >
                Lobe Icons
              </a>{" "}
              (MIT License)
            </p>
          </section>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
