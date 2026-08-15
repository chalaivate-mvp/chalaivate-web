"use client";

import type { Model } from "@/lib/artifacts/types";
import { brandForModel, colorForModel } from "@/lib/artifacts/palette";
import { VendorLogo } from "./ModelMark";

export type BarDatum = { model: Model; value: number | null };

/**
 * กราฟแท่งนอน 1 panel — ใช้ซ้ำทั้งฝั่ง benchmark และฝั่งความคุ้มค่า
 *
 * สเปกแท่งตามมาตรฐาน: หนา 20px (เพดาน 24), ปลายมน 4px ฐานเป็นมุมฉาก,
 * gridline เป็น hairline ทึบ, ค่าติดที่ปลายแท่งเสมอเพื่อไม่ให้ tooltip
 * เป็นทางเดียวที่จะอ่านค่าได้
 *
 * ทุกแท่งมีโลโก้ + ชื่อรุ่นกำกับ ไม่ได้อาศัยสีอย่างเดียวในการบอกว่าแท่งไหนคือใคร
 * เพราะสีแบรนด์บางคู่ใกล้กันมาก (ตระกูล Claude ตั้งใจให้คล้ายกัน) — ดู palette.ts
 */
export default function BarPanel({
  label,
  description,
  data,
  scaleMax,
  ticks,
  format,
  formatTick,
  higherIsBetter = true,
}: {
  label: string;
  description: string;
  data: BarDatum[];
  scaleMax: number;
  ticks: number[];
  format: (v: number) => string;
  /** ป้ายแกน x — แยกจาก format เพราะ tick ควรเป็นเลขกลม ๆ ไม่ใส่ทศนิยม */
  formatTick?: (v: number) => string;
  higherIsBetter?: boolean;
}) {
  const tickLabel = formatTick ?? format;
  // ราง bar เริ่มหลัง label + gap และจบก่อนคอลัมน์ค่า (3rem) + gap
  const trackLeft = "calc(var(--bar-label-w) + 0.75rem)";
  const trackRight = "3.75rem";
  const withData = data.filter(
    (d): d is { model: Model; value: number } => d.value !== null,
  );
  const best = withData.length
    ? higherIsBetter
      ? Math.max(...withData.map((d) => d.value))
      : Math.min(...withData.map((d) => d.value))
    : null;

  return (
    <div className="rounded-3xl bg-white/[0.03] border border-white/[0.06] p-5">
      <h4 className="text-white font-bold">{label}</h4>
      <p className="text-xs text-gray-500 mt-1 mb-5 leading-snug">
        {description}
      </p>

      <div className="relative">
        <div
          className="absolute top-0 bottom-0 flex justify-between pointer-events-none"
          style={{ left: trackLeft, right: trackRight }}
        >
          {ticks.map((t) => (
            <span
              key={t}
              className="w-px h-full"
              style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
            />
          ))}
        </div>

        <div className="relative space-y-2">
          {data.map(({ model, value }) => {
            const color = colorForModel(model.id);
            const isBest =
              value !== null && value === best && withData.length > 1;
            const pct =
              value === null
                ? 0
                : Math.max(0, Math.min(100, (value / scaleMax) * 100));

            return (
              <div
                key={model.id}
                className="group relative flex items-center gap-3"
                tabIndex={0}
                aria-label={`${model.shortName}: ${
                  value === null ? "ไม่มีข้อมูล" : format(value)
                }`}
              >
                <span
                  className="shrink-0 flex items-center gap-1.5 text-xs text-gray-400 min-w-0"
                  style={{ width: "var(--bar-label-w)" }}
                >
                  <VendorLogo
                    logo={brandForModel(model.id).logo}
                    size={13}
                    color={color}
                  />
                  <span className="truncate">{model.shortName}</span>
                </span>

                <span className="flex-1 h-5 relative">
                  {value === null ? (
                    <span className="absolute inset-y-0 left-0 flex items-center text-xs text-gray-600">
                      N/A
                    </span>
                  ) : (
                    <span
                      className="absolute inset-y-0 left-0 transition-[width] duration-500 ease-out"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: color,
                        borderRadius: "0 4px 4px 0",
                      }}
                    />
                  )}
                </span>

                <span
                  className={`w-12 shrink-0 text-right text-xs tabular-nums ${
                    isBest ? "text-white font-bold" : "text-gray-400"
                  }`}
                >
                  {value === null ? "—" : format(value)}
                </span>

                <span className="pointer-events-none absolute left-20 -top-9 z-30 hidden group-hover:block group-focus-within:block">
                  <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl bg-deep-navy border border-white/15 px-3 py-1.5 text-xs shadow-lg shadow-black/40">
                    <VendorLogo
                      logo={brandForModel(model.id).logo}
                      size={14}
                      color={color}
                    />
                    <span className="text-white font-medium">{model.name}</span>
                    <span className="text-gray-400 tabular-nums">
                      {value === null ? "ไม่มีข้อมูล" : format(value)}
                    </span>
                  </span>
                </span>
              </div>
            );
          })}
        </div>

        <div
          className="mt-3 flex justify-between text-[10px] text-gray-600 tabular-nums"
          style={{ marginLeft: trackLeft, marginRight: trackRight }}
        >
          {ticks.map((t) => (
            <span key={t}>{tickLabel(t)}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
