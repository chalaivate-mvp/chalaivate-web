"use client";

import type { Model } from "@/lib/artifacts/types";
import { benchmarkMeta, blendedPrice } from "@/lib/artifacts/data";
import BarPanel from "./BarPanel";
import ModelMark from "./ModelMark";

/**
 * Small multiples — 1 panel ต่อ 1 benchmark + 2 panel ด้านความคุ้มค่า
 *
 * ฝั่ง benchmark ทุก panel ใช้สเกล 0–100 เท่ากัน เพราะทุกตัวเป็น % ที่มีเพดานจริง
 * ที่ 100 — ถ้ายืดสเกลให้เต็มกรอบแต่ละใบ HLE ที่คะแนน 20 จะดูสูงเท่า MMLU ที่ 90
 *
 * ราคากับคะแนนอยู่คนละ panel โดยตั้งใจ ไม่เอามารวมเป็นกราฟแกนคู่
 * เพราะการจับสองสเกลมาวางทับกันจะสร้างความสัมพันธ์ที่ไม่มีอยู่จริง
 */

const PERCENT_TICKS = [0, 25, 50, 75, 100];

function Legend({
  selected,
}: {
  selected: Model[];
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-5">
      {selected.map((m) => (
        <ModelMark
          key={m.id}
          modelId={m.id}
          label={m.name}
          size={15}
          className="text-sm"
          labelClassName="text-gray-300"
        />
      ))}
    </div>
  );
}

/** ปัดเพดานขึ้นเป็นเลขกลม เพื่อให้ tick อ่านง่าย */
function niceMax(raw: number): number {
  if (raw <= 0) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  return Math.ceil(raw / magnitude) * magnitude;
}

export default function BenchmarkCharts({
  selected,
}: {
  selected: Model[];
}) {
  if (selected.length === 0) return null;

  const prices = selected
    .map((m) => blendedPrice(m))
    .filter((v): v is number => v !== null);
  const priceMax = niceMax(prices.length ? Math.max(...prices) : 1);

  const efficiencies = selected.map((m) => {
    const price = blendedPrice(m);
    const score = m.indices.intelligence;
    return price && score !== null && price > 0 ? score / price : null;
  });
  const effValues = efficiencies.filter((v): v is number => v !== null);
  const effMax = niceMax(effValues.length ? Math.max(...effValues) : 1);

  const quarterTicks = (max: number) => [0, max / 4, max / 2, (max * 3) / 4, max];

  return (
    <div style={{ ["--bar-label-w" as string]: "5.5rem" }}>
      <Legend selected={selected} />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {benchmarkMeta.map((meta) => (
          <BarPanel
            key={meta.key}
            label={meta.label}
            description={meta.description}
            scaleMax={100}
            ticks={PERCENT_TICKS}
            format={(v) => v.toFixed(1)}
            formatTick={(v) => String(v)}
            data={selected.map((model) => ({
              model,
              value: model.benchmarks[meta.key],
            }))}
          />
        ))}

        <BarPanel
          label="ราคาใช้งานจริง"
          description="ถัวเฉลี่ย input:output ที่ 3:1 (สัดส่วนคร่าว ๆ ของงานแบบแชท) — ยิ่งต่ำยิ่งดี"
          scaleMax={priceMax}
          ticks={quarterTicks(priceMax)}
          higherIsBetter={false}
          format={(v) => `$${v.toFixed(2)}`}
          formatTick={(v) => `$${Math.round(v)}`}
          data={selected.map((model) => ({
            model,
            value: blendedPrice(model),
          }))}
        />

        <BarPanel
          label="ความคุ้มค่า"
          description="คะแนน Intelligence ที่ได้ต่อราคา 1 ดอลลาร์ — ยิ่งสูงยิ่งคุ้ม"
          scaleMax={effMax}
          ticks={quarterTicks(effMax)}
          format={(v) => v.toFixed(1)}
          formatTick={(v) => String(Math.round(v))}
          data={selected.map((model, i) => ({
            model,
            value: efficiencies[i],
          }))}
        />
      </div>

      <p className="text-xs text-gray-500 mt-4 leading-relaxed">
        กราฟ benchmark ทุกใบใช้สเกล 0–100% เท่ากัน — Humanity&apos;s Last Exam
        คะแนนต่ำกว่าตัวอื่นมากเพราะเป็นชุดคำถามที่ยากที่สุด ไม่ได้แปลว่าโมเดลแย่
      </p>
    </div>
  );
}
