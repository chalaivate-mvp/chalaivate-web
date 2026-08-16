import type { ArtKey } from "@/components/ProjectArt";

/**
 * เนื้อหาโปรไฟล์ อ.ชลัยวัฒน์ — แหล่งความจริงเดียวของหน้าแรก
 *
 * แยกออกจาก page.tsx เพราะเดิมเนื้อหาฝังอยู่ใน JSX 500 บรรทัด ทำให้แก้ตัวเลข
 * ทีต้องไล่หาในกอง markup และเคยหลุดจนตัวเลขในหน้าเว็บ (10,000+ ผู้เรียน)
 * ไม่ตรงกับ tagline ใน site.ts (90,000+) มาแล้ว
 *
 * สถิติทั้งหมดในไฟล์นี้เป็น "ผลงานของ 9Expert" ที่ อ.ชลัยวัฒน์เป็นผู้ก่อตั้ง
 * ไม่ใช่ตัวเลขส่วนบุคคล — หน้าเว็บต้องเขียนกำกับให้ชัดทุกครั้งที่แสดง
 */

/** ตัวเลขแยกจากหน่วย เพราะ animation นับเลขต้องใช้ค่าดิบ */
export type Stat = {
  /** ค่าดิบสำหรับนับขึ้น */
  value: number;
  /** ต่อท้ายหลังตัวเลข เช่น "+", "M+", "K+" */
  suffix: string;
  /** ทศนิยมที่ต้องแสดง — 1.28M ต้องได้ 2 ตำแหน่ง */
  decimals?: number;
  label: string;
  note: string;
};

export const STATS: Stat[] = [
  {
    value: 90000,
    suffix: "+",
    label: "ผู้เข้าอบรม",
    note: "องค์กร ราชการ และสถาบันการศึกษา",
  },
  {
    value: 5000,
    suffix: "+",
    label: "องค์กรที่ให้บริการ",
    note: "เอกชน ข้ามชาติ และหน่วยงาน UN",
  },
  {
    value: 307,
    suffix: "",
    label: "บริษัทจดทะเบียน",
    note: "263 SET · 44 mai",
  },
  {
    value: 1.28,
    suffix: "M+",
    decimals: 2,
    label: "ผู้ติดตาม",
    note: "5 ช่องทางที่ยังเคลื่อนไหว",
  },
  {
    value: 19.2,
    suffix: "M+",
    decimals: 1,
    label: "YouTube views",
    note: "246K subscribers · @9expert",
  },
  {
    value: 177,
    suffix: "K+",
    label: "สมาชิกคอมมูนิตี้",
    note: "6 คอมมูนิตี้ Microsoft ที่ก่อตั้งและดูแล",
  },
];

export type Award = {
  /** ป้ายเล็กเหนือหัวข้อ เช่น "MICROSOFT · 2023–2027" */
  eyebrow: string;
  title: string;
  desc: string;
};

export const AWARDS: Award[] = [
  {
    eyebrow: "Microsoft · 2023–2027",
    title: "Most Valuable Professional",
    desc: "มอบให้ผู้นำชุมชนเทคโนโลยีที่สร้างคุณูปการต่อเนื่อง — ได้รับติดต่อกัน 5 ปี",
  },
  {
    eyebrow: "First in Thailand",
    title: "Power BI MVP คนแรกของไทย",
    desc: "ผู้ได้รับตำแหน่ง Microsoft MVP สาขา Power BI คนแรกในประเทศไทย และเป็นผู้วางรากฐานคอมมูนิตี้ BI ของประเทศ",
  },
  {
    eyebrow: "YouTube · 100,000+ subs",
    title: "Silver Creator Award",
    desc: "ช่อง @9expert ผ่านหลักหมุดแสนผู้ติดตาม ปัจจุบัน 246K subscribers และยอดชม 19.2M+ ครั้ง",
  },
];

export type Partnership = {
  period: string;
  title: string;
  org: string;
  desc: string;
};

export const PARTNERSHIPS: Partnership[] = [
  {
    period: "ม.ค. 2026",
    title: "The Next Humans Skills",
    org: "Bitkub × 9Expert × Key Solutions Training",
    desc: "พันธมิตรสามฝ่ายเพื่อยกระดับทักษะกำลังคนไทยด้าน AI, data และ digital transformation ครอบคลุมทั้งองค์กรใหญ่และ SMB",
  },
  {
    period: "มี.ค. 2026",
    title: "คณะเทคโนโลยีการเกษตร สจล.",
    org: "บันทึกข้อตกลงความร่วมมือทางวิชาการ",
    desc: "นำ AI และ data analytics เข้าสู่หลักสูตรเทคโนโลยีการเกษตร ร่วมพัฒนาโมดูลการเรียนและงานวิจัย",
  },
  {
    period: "พันธมิตรระยะยาว",
    title: "Microsoft",
    org: "MVP · MCT · Community Programs",
    desc: "ความร่วมมือต่อเนื่องหลายปีครอบคลุม Power Platform, Fabric และ Copilot ร่วมจัดกิจกรรมคอมมูนิตี้และออกแบบเส้นทางการเรียนรู้",
  },
];

export type Project = {
  period: string;
  title: string;
  org: string;
  desc: string;
  tags: string[];
  /* ภาพประกอบวาดด้วย SVG ให้เล่าเนื้องาน ไม่ใช่ภาพถ่ายคนทำ — ดู ProjectArt.tsx */
  art: ArtKey;
};

export const PROJECTS: Project[] = [
  {
    period: "มี.ค. 2025",
    title: "AOT Operations Dashboard",
    org: "บริษัท ท่าอากาศยานไทย จำกัด (มหาชน)",
    desc: "Dashboard วิเคราะห์ระดับองค์กร ติดตามการไหลของผู้โดยสารและงานปฏิบัติการครบทั้ง 7 สนามบินของ AOT",
    tags: ["Power Query", "Power BI"],
    art: "aot",
  },
  {
    period: "2020",
    title: "BJC Sales Performance Dashboard",
    org: "บริษัท เบอร์ลี่ ยุคเกอร์ จำกัด (มหาชน)",
    desc: "ระบบวิเคราะห์ยอดขายให้กลุ่มสินค้าอุปโภคบริโภครายใหญ่ที่สุดรายหนึ่งของไทย เห็นภาพทั้งประเทศและเจาะลึกได้ถึงระดับสาขา",
    tags: ["Power BI", "Sales Analytics"],
    art: "bjc",
  },
  {
    period: "มิ.ย. 2017 – พ.ค. 2019",
    title: "เว็บไซต์กระทรวงแรงงาน",
    org: "กระทรวงแรงงาน",
    desc: "เว็บไซต์หน่วยงานราชการ 101 เว็บ — วางมาตรฐานตัวตนดิจิทัลระดับประเทศ ออกแบบให้เข้าถึงได้ตั้งแต่ต้น",
    tags: ["Web stack", "WCAG"],
    art: "web",
  },
];

export type ContactLink = {
  label: string;
  value: string;
  href: string;
  /** ชื่อไอคอนที่ ContactSection รู้จัก */
  icon: "web" | "youtube" | "facebook" | "tiktok" | "mail";
};

/**
 * ช่องทางติดต่อ — ทุก URL ยืนยันโดยเจ้าของเว็บแล้ว ไม่มีตัวไหนเดาเอง
 *
 * ห้ามเติมช่องทางใหม่โดยเดา URL จากชื่อแบรนด์ เดาผิดทีเดียวอาจพาผู้ใช้
 * ไปบัญชีคนอื่นหรือเพจปลอม ซึ่งเสียหายกว่าการไม่มีลิงก์นั้นเลย
 */
export const CONTACTS: ContactLink[] = [
  {
    label: "เว็บไซต์",
    value: "9experttraining.com",
    href: "https://www.9experttraining.com",
    icon: "web",
  },
  {
    label: "YouTube",
    value: "@9expert",
    href: "https://www.youtube.com/@9expert",
    icon: "youtube",
  },
  {
    label: "Facebook",
    value: "9experttraining",
    href: "https://www.facebook.com/9experttraining",
    icon: "facebook",
  },
  {
    label: "TikTok",
    value: "@9expert",
    href: "https://www.tiktok.com/@9expert",
    icon: "tiktok",
  },
];

/** อีเมลสำหรับเชิญเป็นวิทยากร */
export const SPEAKER_EMAIL = "training@9expert.co.th";
