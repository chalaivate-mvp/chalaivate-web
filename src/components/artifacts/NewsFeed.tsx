"use client";

import { useMemo, useState } from "react";
import type { NewsCategory, NewsItem } from "@/lib/artifacts/types";
import { brandForModel, colorForModel } from "@/lib/artifacts/palette";
import { formatDate, getModel } from "@/lib/artifacts/data";
import { VendorLogo } from "./ModelMark";

const CATEGORY_LABEL: Record<NewsCategory, string> = {
  "model-release": "โมเดลใหม่",
  research: "งานวิจัย",
  product: "ฟีเจอร์",
  business: "ธุรกิจ",
  policy: "มาตรฐาน/นโยบาย",
};

const CATEGORIES = Object.keys(CATEGORY_LABEL) as NewsCategory[];

export default function NewsFeed({
  items,
  selection,
}: {
  items: NewsItem[];
  selection: string[];
}) {
  const [category, setCategory] = useState<NewsCategory | "all">("all");
  const [onlySelected, setOnlySelected] = useState(false);

  const filtered = useMemo(() => {
    return items
      .filter((n) => category === "all" || n.category === category)
      .filter(
        (n) =>
          !onlySelected ||
          selection.length === 0 ||
          n.relatedModels.some((id) => selection.includes(id)),
      )
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  }, [items, category, onlySelected, selection]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <button
          type="button"
          onClick={() => setCategory("all")}
          aria-pressed={category === "all"}
          className={`px-3.5 py-1.5 rounded-full text-sm border transition-colors ${
            category === "all"
              ? "border-white/25 bg-white/[0.07] text-white"
              : "border-white/10 text-gray-300 hover:border-blue-primary/40 hover:text-white"
          }`}
        >
          ทั้งหมด
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            aria-pressed={category === c}
            className={`px-3.5 py-1.5 rounded-full text-sm border transition-colors ${
              category === c
                ? "border-white/25 bg-white/[0.07] text-white"
                : "border-white/10 text-gray-300 hover:border-blue-primary/40 hover:text-white"
            }`}
          >
            {CATEGORY_LABEL[c]}
          </button>
        ))}

        <label className="ml-auto inline-flex items-center gap-2 text-sm text-gray-300 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={onlySelected}
            onChange={(e) => setOnlySelected(e.target.checked)}
            className="w-4 h-4 rounded accent-blue-primary"
          />
          เฉพาะโมเดลที่เลือกไว้
        </label>
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-400 text-sm py-8 text-center">
          ไม่มีข่าวที่ตรงกับเงื่อนไขนี้
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((item) => (
            <article
              key={item.id}
              className="rounded-3xl bg-white/[0.03] border border-white/[0.06] p-5 hover:border-blue-primary/30 transition-colors flex flex-col"
            >
              <div className="flex items-center gap-3 mb-3 text-xs">
                <span className="px-2.5 py-1 rounded-full bg-blue-primary/15 text-blue-light font-medium">
                  {CATEGORY_LABEL[item.category]}
                </span>
                <time dateTime={item.publishedAt} className="text-gray-500">
                  {formatDate(item.publishedAt)}
                </time>
              </div>

              <h4 className="text-white font-bold leading-snug mb-2">
                {item.title}
              </h4>
              <p className="text-sm text-gray-400 leading-relaxed flex-1">
                {item.summary}
              </p>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-4 pt-4 border-t border-white/[0.06]">
                {/* โลโก้บอกว่าข่าวนี้เกี่ยวกับโมเดลของค่ายไหน */}
                <span className="flex items-center gap-2">
                  {item.relatedModels.map((id) => {
                    const model = getModel(id);
                    if (!model) return null;
                    return (
                      <span key={id} title={model.name}>
                        <VendorLogo
                          logo={brandForModel(id).logo}
                          size={14}
                          color={colorForModel(id)}
                        />
                      </span>
                    );
                  })}
                </span>
                <span className="text-xs text-gray-500">{item.source}</span>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto text-xs text-blue-light hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  อ่านต้นฉบับ
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
