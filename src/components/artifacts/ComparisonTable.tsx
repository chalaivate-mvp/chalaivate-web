"use client";

import { Fragment, type ReactNode } from "react";
import type { Model } from "@/lib/artifacts/types";
import { colorForModel } from "@/lib/artifacts/palette";
import { benchmarkMeta, formatDate, formatTokens } from "@/lib/artifacts/data";
import ModelMark from "./ModelMark";

type Row = {
  label: string;
  hint?: string;
  /** ค่าดิบสำหรับหาตัวที่ดีที่สุด — null = ไม่มีข้อมูล */
  value: (m: Model) => number | null;
  /** ทิศทางที่ถือว่า "ดี" — null = ไม่ต้องไฮไลต์ (ไม่มีดี/แย่) */
  best: "max" | "min" | null;
  render: (m: Model) => ReactNode;
};

type Group = { title: string; rows: Row[] };

const yesNo = (v: boolean) => (
  <span className={v ? "text-white" : "text-gray-500"}>{v ? "รองรับ" : "—"}</span>
);

const MCP_LABEL: Record<Model["features"]["mcp"], string> = {
  native: "Native",
  wrapper: "ผ่าน wrapper",
  none: "ไม่รองรับ",
};

const GROUPS: Group[] = [
  {
    title: "ภาพรวม",
    rows: [
      {
        label: "ผู้พัฒนา",
        value: () => null,
        best: null,
        render: (m) => m.vendor,
      },
      {
        label: "วันที่เปิดตัว",
        value: () => null,
        best: null,
        render: (m) => formatDate(m.releaseDate),
      },
      {
        label: "เปิด weights",
        hint: "ดาวน์โหลดไป deploy บนเครื่องตัวเองได้หรือไม่",
        value: () => null,
        best: null,
        render: (m) =>
          m.openWeights ? (
            <span className="text-white">
              เปิด{m.license ? ` · ${m.license}` : ""}
            </span>
          ) : (
            <span className="text-gray-500">ปิด</span>
          ),
      },
    ],
  },
  {
    title: "ขีดความสามารถ",
    rows: [
      {
        label: "Context window",
        hint: "จำนวน token สูงสุดที่ป้อนเข้าไปได้ในครั้งเดียว",
        value: (m) => m.contextWindow,
        best: "max",
        render: (m) => `${formatTokens(m.contextWindow)} tokens`,
      },
      {
        label: "Max output",
        value: (m) => m.maxOutputTokens,
        best: "max",
        render: (m) => `${formatTokens(m.maxOutputTokens)} tokens`,
      },
      {
        label: "Multimodal",
        hint: "รับภาพ/เสียง/วิดีโอได้นอกเหนือจากข้อความ",
        value: () => null,
        best: null,
        render: (m) => yesNo(m.features.multimodal),
      },
    ],
  },
  {
    title: "Benchmark (%)",
    rows: benchmarkMeta.map((meta) => ({
      label: meta.label,
      hint: meta.description,
      value: (m: Model) => m.benchmarks[meta.key],
      best: "max" as const,
      render: (m: Model) => {
        const v = m.benchmarks[meta.key];
        return v === null ? (
          <span className="text-gray-500">N/A</span>
        ) : (
          v.toFixed(1)
        );
      },
    })),
  },
  {
    title: "ดัชนีรวม (0–100)",
    rows: (
      [
        ["intelligence", "Intelligence", "คะแนนรวมความสามารถทั่วไป"],
        ["coding", "Coding", "คะแนนรวมด้านการเขียนโปรแกรม"],
      ] as const
    ).map(([key, label, hint]) => ({
      label,
      hint,
      value: (m: Model) => m.indices[key],
      best: "max" as const,
      render: (m: Model) => {
        const v = m.indices[key];
        return v === null ? <span className="text-gray-500">N/A</span> : v;
      },
    })),
  },
  {
    title: "ราคา (USD ต่อ 1M tokens)",
    rows: [
      {
        label: "Input",
        value: (m) => m.pricing.input,
        best: "min",
        render: (m) =>
          m.pricing.input === null ? (
            <span className="text-gray-500">N/A</span>
          ) : (
            `$${m.pricing.input.toFixed(2)}`
          ),
      },
      {
        label: "Output",
        value: (m) => m.pricing.output,
        best: "min",
        render: (m) =>
          m.pricing.output === null ? (
            <span className="text-gray-500">N/A</span>
          ) : (
            `$${m.pricing.output.toFixed(2)}`
          ),
      },
    ],
  },
  {
    title: "ความเร็ว",
    rows: [
      {
        label: "Output speed",
        hint: "จำนวน token ที่สร้างได้ต่อวินาที — ยิ่งมากยิ่งเร็ว",
        value: (m) => m.speed.tokensPerSecond,
        best: "max",
        render: (m) =>
          m.speed.tokensPerSecond === null ? (
            <span className="text-gray-500">N/A</span>
          ) : (
            `${m.speed.tokensPerSecond} tok/s`
          ),
      },
      {
        label: "Time to first token",
        hint: "เวลารอก่อนเห็นตัวอักษรแรก — ยิ่งน้อยยิ่งดี",
        value: (m) => m.speed.firstTokenSeconds,
        best: "min",
        render: (m) =>
          m.speed.firstTokenSeconds === null ? (
            <span className="text-gray-500">N/A</span>
          ) : (
            `${m.speed.firstTokenSeconds.toFixed(1)} วิ`
          ),
      },
    ],
  },
  {
    title: "ฟีเจอร์",
    rows: [
      {
        label: "MCP",
        hint: "Model Context Protocol — มาตรฐานต่อเครื่องมือภายนอก",
        value: () => null,
        best: null,
        render: (m) => (
          <span
            className={
              m.features.mcp === "none" ? "text-gray-500" : "text-white"
            }
          >
            {MCP_LABEL[m.features.mcp]}
          </span>
        ),
      },
      {
        label: "Tool use",
        value: () => null,
        best: null,
        render: (m) => yesNo(m.features.toolUse),
      },
      {
        label: "ค้นเว็บในตัว",
        value: () => null,
        best: null,
        render: (m) => yesNo(m.features.webSearch),
      },
      {
        label: "อ่านไฟล์เอกสาร",
        value: () => null,
        best: null,
        render: (m) => yesNo(m.features.documentHandling),
      },
      {
        label: "ตั้งเวลางาน",
        value: () => null,
        best: null,
        render: (m) => yesNo(m.features.scheduling),
      },
    ],
  },
];

const LIST_ROWS = [
  { title: "จุดเด่น", pick: (m: Model) => m.strengths, marker: "+" },
  { title: "จุดด้อย", pick: (m: Model) => m.weaknesses, marker: "−" },
  { title: "เหมาะกับ", pick: (m: Model) => m.bestFor, marker: "›" },
] as const;

export default function ComparisonTable({
  selected,
}: {
  selected: Model[];
}) {
  if (selected.length === 0) return null;

  /** id ของโมเดลที่ค่าดีที่สุดในแถวนั้น — เสมอกันได้หลายตัว */
  const bestIds = (row: Row): Set<string> => {
    if (!row.best) return new Set();
    const pairs = selected
      .map((m) => [m.id, row.value(m)] as const)
      .filter((p): p is readonly [string, number] => p[1] !== null);
    if (pairs.length < 2) return new Set();
    const target =
      row.best === "max"
        ? Math.max(...pairs.map((p) => p[1]))
        : Math.min(...pairs.map((p) => p[1]));
    return new Set(pairs.filter((p) => p[1] === target).map((p) => p[0]));
  };

  return (
    <div className="rounded-3xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
      {/* ตารางกว้างเกินจอมือถือแน่นอน — ให้เลื่อนในกล่องตัวเอง ไม่ใช่ทั้งหน้า */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm min-w-[640px]">
          <thead>
            <tr>
              <th className="sticky left-0 z-20 bg-[#142230] text-left font-bold text-gray-400 px-4 py-4 border-b border-white/[0.08] min-w-[180px]">
                รายการ
              </th>
              {selected.map((m) => (
                <th
                  key={m.id}
                  className="text-left px-4 py-4 border-b border-white/[0.08] min-w-[150px] align-bottom"
                >
                  {/* แถบสีค่ายบนหัวคอลัมน์ ช่วยกวาดตาหาโมเดลที่ต้องการเร็วขึ้น */}
                  <span
                    className="block h-1 w-8 rounded-full mb-2"
                    style={{ backgroundColor: colorForModel(m.id) }}
                  />
                  <ModelMark
                    modelId={m.id}
                    label={m.shortName}
                    size={16}
                    labelClassName="font-bold text-white"
                  />
                  <span className="block text-xs text-gray-500 font-normal mt-1 pl-6">
                    {m.vendor}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {GROUPS.map((group) => (
              <Fragment key={group.title}>
                <tr>
                  <td
                    colSpan={selected.length + 1}
                    className="sticky left-0 bg-white/[0.02] px-4 py-2 text-xs font-bold tracking-widest uppercase text-amber-accent border-y border-white/[0.06]"
                  >
                    {group.title}
                  </td>
                </tr>

                {group.rows.map((row) => {
                  const winners = bestIds(row);
                  return (
                    <tr
                      key={`${group.title}-${row.label}`}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <th
                        scope="row"
                        className="sticky left-0 z-10 bg-[#142230] text-left font-normal text-gray-300 px-4 py-3 border-b border-white/[0.04] align-top"
                      >
                        {row.label}
                        {row.hint && (
                          <span
                            className="block text-xs text-gray-500 mt-0.5 leading-snug"
                            title={row.hint}
                          >
                            {row.hint}
                          </span>
                        )}
                      </th>
                      {selected.map((m) => {
                        const isBest = winners.has(m.id);
                        return (
                          <td
                            key={m.id}
                            className={`px-4 py-3 border-b border-white/[0.04] align-top tabular-nums ${
                              isBest ? "text-white font-bold" : "text-gray-200"
                            }`}
                          >
                            <span className="inline-flex items-center gap-1.5">
                              {row.render(m)}
                              {isBest && (
                                <span
                                  title="ดีที่สุดในกลุ่มที่เลือก"
                                  aria-label="ดีที่สุดในกลุ่มที่เลือก"
                                  className="text-amber-accent text-xs"
                                >
                                  ★
                                </span>
                              )}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </Fragment>
            ))}

            {LIST_ROWS.map((block) => (
              <Fragment key={block.title}>
                <tr>
                  <td
                    colSpan={selected.length + 1}
                    className="sticky left-0 bg-white/[0.02] px-4 py-2 text-xs font-bold tracking-widest uppercase text-amber-accent border-y border-white/[0.06]"
                  >
                    {block.title}
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="sticky left-0 z-10 bg-[#142230] text-left font-normal text-gray-500 px-4 py-3 border-b border-white/[0.04] align-top text-xs"
                  >
                    3 ข้อหลัก
                  </th>
                  {selected.map((m) => (
                    <td
                      key={m.id}
                      className="px-4 py-3 border-b border-white/[0.04] align-top"
                    >
                      <ul className="space-y-1.5">
                        {block.pick(m).map((item, i) => (
                          <li
                            key={i}
                            className="text-gray-300 text-xs leading-relaxed flex gap-1.5"
                          >
                            <span className="text-gray-600 shrink-0">
                              {block.marker}
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
