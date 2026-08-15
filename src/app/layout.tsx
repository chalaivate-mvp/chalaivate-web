import type { Metadata } from "next";
import { Inter, Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/JsonLd";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai"],
  variable: "--font-thai",
  display: "swap",
  weight: ["100", "400", "700", "800", "900"],
});

const ROOT_TITLE = "9Expert Training — AI, Cloud & Digital Transformation";
const ROOT_DESC =
  "9Expert Training — ผู้เชี่ยวชาญด้าน AI, Cloud, Data และ Digital Transformation นำโดย ชไลเวท พิพัฒพรรณวงศ์ CEO & Co-Founder, Microsoft MVP";

export const metadata: Metadata = {
  /**
   * metadataBase ทำให้ทุก field ที่ต้องใช้ absolute URL (canonical, og:image,
   * og:url) เขียนเป็น path สั้น ๆ ได้ แล้ว Next เติม domain ให้เอง
   * ถ้าไม่ตั้ง og:image จะออกมาเป็น path สัมพัทธ์ซึ่ง Facebook/LINE อ่านไม่ออก
   */
  metadataBase: new URL(SITE_URL),
  title: {
    default: ROOT_TITLE,
    // หน้าลูกที่ตั้ง title เองจะถูกใช้ตรง ๆ ไม่ต่อท้ายซ้ำ
    template: "%s",
  },
  description: ROOT_DESC,
  applicationName: SITE_NAME,
  // คง "อ.เวท" ไว้ใน keywords เพราะเป็นคำที่คนใช้ค้นหาจริง
  keywords: [
    "9Expert Training",
    "9Expert",
    "Chalaivate",
    "อ.เวท",
    "Microsoft MVP",
    "Digital Transformation",
    "AI Training",
    "Software Development",
  ],
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      // ให้ Google ดึงรูปขนาดใหญ่ไปแสดงในผลค้นหาได้
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: ROOT_TITLE,
    description: ROOT_DESC,
    url: "/",
    siteName: SITE_NAME,
    type: "website",
    locale: "th_TH",
  },
  twitter: {
    card: "summary_large_image",
    title: ROOT_TITLE,
    description: ROOT_DESC,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${inter.variable} ${notoSansThai.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.cdnfonts.com/css/line-seed-sans"
          crossOrigin="anonymous"
        />
        {/* ข้อมูลองค์กรและตัวเว็บ — ทุกหน้าอ้าง @id เหล่านี้ต่อได้ */}
        <OrganizationJsonLd />
        <WebSiteJsonLd />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
