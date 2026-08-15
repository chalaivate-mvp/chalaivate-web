"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Model, NewsItem } from "@/lib/artifacts/types";
import { MAX_SELECTED } from "@/lib/artifacts/palette";
import ModelSlicer from "./ModelSlicer";
import ComparisonTable from "./ComparisonTable";
import BenchmarkCharts from "./BenchmarkCharts";
import NewsFeed from "./NewsFeed";

const PARAM = "models";
const DEFAULT_SELECTION = ["claude-opus-5", "gpt-5-6-sol", "gemini-3-1-pro"];

/**
 * เจ้าของ state ของทั้งหน้า — slicer, ตาราง, กราฟ และข่าว อ่านชุดเดียวกันหมด
 *
 * แหล่งความจริงคือ URL (?models=a,b,c) ไม่ใช่ useState ภายใน เพราะ:
 *   1. ผู้ใช้ก๊อปลิงก์ไปแชร์แล้วอีกฝ่ายเห็นชุดเปรียบเทียบเดียวกัน
 *   2. ปุ่ม back/forward ของเบราว์เซอร์ทำงานถูกต้อง
 *   3. รีเฟรชหน้าแล้วไม่หลุดกลับค่าเริ่มต้น
 */
export default function ModelExplorer({
  models,
  news,
}: {
  models: Model[];
  news: NewsItem[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const validIds = useMemo(() => new Set(models.map((m) => m.id)), [models]);

  const selection = useMemo(() => {
    const raw = searchParams.get(PARAM);
    // ไม่มี param เลย = เข้าหน้าครั้งแรก ใช้ค่าเริ่มต้น
    // param เป็นค่าว่าง = ผู้ใช้กด "ล้างทั้งหมด" ต้องเคารพว่าไม่เลือกอะไรเลย
    if (raw === null) return DEFAULT_SELECTION.filter((id) => validIds.has(id));
    return raw
      .split(",")
      .map((s) => s.trim())
      .filter((id) => validIds.has(id))
      .filter((id, i, arr) => arr.indexOf(id) === i)
      .slice(0, MAX_SELECTED);
  }, [searchParams, validIds]);

  const push = useCallback(
    (next: string[]) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(PARAM, next.join(","));
      // replace ไม่ push — ไม่อยากให้การกดชิปแต่ละครั้งไปกอง history
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const toggle = useCallback(
    (id: string) => {
      if (selection.includes(id)) {
        push(selection.filter((x) => x !== id));
      } else if (selection.length < MAX_SELECTED) {
        push([...selection, id]);
      }
    },
    [selection, push],
  );

  const selected = useMemo(
    () =>
      selection
        .map((id) => models.find((m) => m.id === id))
        .filter((m): m is Model => Boolean(m)),
    [selection, models],
  );

  return (
    <div className="space-y-12">
      <ModelSlicer
        models={models}
        selection={selection}
        onToggle={toggle}
        onSelectAll={() => push(models.map((m) => m.id))}
        onSelectDefault={() => push(DEFAULT_SELECTION)}
        onClear={() => push([])}
      />

      {selected.length > 0 && (
        <>
          <section id="table" className="scroll-mt-24">
            <h3 className="text-xl font-bold text-white mb-1">ตารางเปรียบเทียบ</h3>
            <p className="text-sm text-gray-400 mb-5">
              ★ = ค่าที่ดีที่สุดในกลุ่มที่เลือกไว้ · เลื่อนตารางแนวนอนเพื่อดูคอลัมน์ที่เหลือ
            </p>
            <ComparisonTable selected={selected} />
          </section>

          <section id="benchmarks" className="scroll-mt-24">
            <h3 className="text-xl font-bold text-white mb-1">
              คะแนน Benchmark และความคุ้มค่า
            </h3>
            <p className="text-sm text-gray-400 mb-5">
              เอาเมาส์ชี้ที่แท่งเพื่อดูรายละเอียด
            </p>
            <BenchmarkCharts selected={selected} />
          </section>
        </>
      )}

      <section id="news" className="scroll-mt-24">
        <h3 className="text-xl font-bold text-white mb-1">ข่าวสาร AI ล่าสุด</h3>
        <p className="text-sm text-gray-400 mb-5">
          อัปเดตอัตโนมัติทุกวัน — โลโก้ท้ายการ์ดบอกว่าข่าวนี้เกี่ยวกับโมเดลของค่ายไหน
        </p>
        <NewsFeed items={news} selection={selection} />
      </section>
    </div>
  );
}
