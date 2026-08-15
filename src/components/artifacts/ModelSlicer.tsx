"use client";

import type { Model } from "@/lib/artifacts/types";
import { brandForModel } from "@/lib/artifacts/palette";
import { VendorLogo } from "./ModelMark";

/**
 * Slicer เลือกโมเดล — วางเป็นแถวเดียวเหนือทุกอย่างที่มันคุม
 * (ห้ามแตกเป็น filter ย่อยในแต่ละการ์ด ผู้อ่านจะไม่รู้ว่ากราฟไหนกรองด้วยอะไร)
 *
 * ลำดับที่กด = ลำดับคอลัมน์ในตารางและแกนกราฟ (กดก่อน = ซ้ายสุด)
 * ส่วนสีผูกกับค่ายผู้พัฒนา ไม่เกี่ยวกับลำดับ — ดู palette.ts
 */
export default function ModelSlicer({
  models,
  selection,
  onToggle,
  onSelectAll,
  onSelectDefault,
  onClear,
}: {
  models: Model[];
  selection: string[];
  onToggle: (id: string) => void;
  onSelectAll: () => void;
  onSelectDefault: () => void;
  onClear: () => void;
}) {
  return (
    <div className="rounded-3xl bg-white/[0.03] border border-white/[0.06] p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3 mb-4">
        <div>
          <h3 className="text-white font-bold">เลือกโมเดลที่ต้องการเปรียบเทียบ</h3>
          <p className="text-sm text-gray-400 mt-1">
            กดก่อน = อยู่ซ้ายสุด · สีและโลโก้ยึดตามค่ายผู้พัฒนา
          </p>
        </div>
        <div className="flex items-center gap-2">
          {[
            { label: "เลือกทั้งหมด", fn: onSelectAll },
            { label: "ค่าเริ่มต้น", fn: onSelectDefault },
            { label: "ล้างทั้งหมด", fn: onClear },
          ].map((b) => (
            <button
              key={b.label}
              type="button"
              onClick={b.fn}
              className="px-3 py-1.5 rounded-full text-sm text-gray-300 border border-white/10 hover:border-blue-primary/40 hover:text-white transition-colors"
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {models.map((model) => {
          const active = selection.includes(model.id);
          const order = selection.indexOf(model.id) + 1;
          const brand = brandForModel(model.id);

          return (
            <button
              key={model.id}
              type="button"
              onClick={() => onToggle(model.id)}
              aria-pressed={active}
              title={`${model.name} · ${model.vendor}`}
              className={`group inline-flex items-center gap-2 pl-2.5 pr-3.5 py-2 rounded-full border text-sm transition-all ${
                active
                  ? "bg-white/[0.07] text-white"
                  : "border-white/10 text-gray-400 hover:border-white/25 hover:text-white"
              }`}
              style={
                active
                  ? { borderColor: brand.color, boxShadow: `inset 0 0 0 1px ${brand.color}33` }
                  : undefined
              }
            >
              <VendorLogo
                logo={brand.logo}
                size={16}
                color={active ? brand.color : undefined}
                className={active ? "" : "text-gray-600"}
              />
              <span className="whitespace-nowrap font-medium">
                {model.shortName}
              </span>
              {active && (
                <span
                  className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                  style={{ backgroundColor: brand.color, color: "#0D1B2A" }}
                >
                  {order}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {selection.length === 0 && (
        <p className="mt-4 text-sm text-amber-accent">
          ยังไม่ได้เลือกโมเดล — กดชิปด้านบนอย่างน้อย 1 ตัวเพื่อดูการเปรียบเทียบ
        </p>
      )}
    </div>
  );
}
