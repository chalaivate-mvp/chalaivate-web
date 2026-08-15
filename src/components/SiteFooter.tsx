import { ORG, SITE_NAME } from "@/lib/site";

/**
 * Footer เดียวใช้ทุกหน้า
 *
 * เดิมเขียนซ้ำ 3 ที่ (หน้าแรก, /artifacts, /artifacts/ai-models) แล้วเนื้อหา
 * เริ่มไม่ตรงกัน — รวบมาไว้ที่เดียวเพื่อไม่ให้ลืมแก้ที่ใดที่หนึ่งอีก
 */
export default function SiteFooter() {
  return (
    <footer className="relative py-8 border-t border-white/5 bg-deep-navy">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <a
          href={ORG.mainSite}
          target="_blank"
          rel="noopener"
          className="text-sm text-gray-400 hover:text-white transition-colors group"
        >
          <span className="text-blue-primary font-bold group-hover:text-blue-light transition-colors">
            {SITE_NAME}
          </span>
          <span className="mx-2 text-gray-600">|</span>
          {ORG.tagline}
        </a>

        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
