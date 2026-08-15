import { VENDOR_LOGOS, type VendorLogoKey } from "@/lib/artifacts/vendor-logos";
import { brandForModel } from "@/lib/artifacts/palette";

/**
 * โลโก้ค่ายผู้พัฒนา ระบายด้วยสีประจำโมเดล
 *
 * โลโก้เป็นช่องระบุตัวตนหลัก ไม่ใช่ของประดับ — สีแบรนด์บางคู่ใกล้กันเกินกว่าจะ
 * แยกด้วยตาเปล่าได้ (โดยเฉพาะตระกูล Claude ที่ตั้งใจให้คล้ายกัน) ทุกจุดที่มีสี
 * จึงต้องมีโลโก้และชื่อรุ่นกำกับเสมอ ดูเหตุผลเต็มใน palette.ts
 */
export function VendorLogo({
  logo,
  size = 16,
  color,
  className = "",
}: {
  logo: VendorLogoKey;
  size?: number;
  /** ไม่ระบุ = สืบสีจาก parent ผ่าน currentColor */
  color?: string;
  className?: string;
}) {
  const icon = VENDOR_LOGOS[logo];
  return (
    <svg
      viewBox={icon.viewBox}
      width={size}
      height={size}
      fill="currentColor"
      fillRule={icon.fillRule}
      aria-hidden="true"
      focusable="false"
      className={`shrink-0 ${className}`}
      style={{ flex: "none", ...(color ? { color } : {}) }}
    >
      {icon.paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}

/**
 * โลโก้ + ชื่อรุ่น — หน่วยระบุตัวตนมาตรฐานที่ใช้ซ้ำทั้งหน้า
 * (ชิป slicer, หัวตาราง, ป้ายแท่งกราฟ, legend)
 */
export default function ModelMark({
  modelId,
  label,
  size = 16,
  /** true = ระบายโลโก้ด้วยสีแบรนด์ · false = สีจาง ใช้ตอนยังไม่ถูกเลือก */
  tinted = true,
  className = "",
  labelClassName = "",
}: {
  modelId: string;
  label: string;
  size?: number;
  tinted?: boolean;
  className?: string;
  labelClassName?: string;
}) {
  const brand = brandForModel(modelId);
  return (
    <span className={`inline-flex items-center gap-2 min-w-0 ${className}`}>
      <VendorLogo
        logo={brand.logo}
        size={size}
        color={tinted ? brand.color : undefined}
        className={tinted ? "" : "text-gray-600"}
      />
      <span className={`truncate ${labelClassName}`}>{label}</span>
    </span>
  );
}
