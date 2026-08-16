"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * ค่อย ๆ โผล่ตอนเลื่อนถึง — ใช้ห่อการ์ดหรือบล็อกเนื้อหา
 *
 * ทำงานครั้งเดียวแล้วเลิกสังเกตการณ์ ไม่ให้เนื้อหากะพริบซ้ำเวลาเลื่อนขึ้นลง
 *
 * ถ้าผู้ใช้ตั้งค่าลดการเคลื่อนไหวไว้ จะข้ามไปสถานะปลายทางทันที ไม่ใช่แค่ทำให้เร็วขึ้น
 * เพราะคนที่เปิดค่านี้ส่วนหนึ่งมีอาการเวียนหัวจากภาพเคลื่อนไหวจริง ๆ
 */
export default function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  /** หน่วงเป็นมิลลิวินาที ใช้ไล่การ์ดทีละใบ */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setShown(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        io.disconnect();
      },
      // เริ่มก่อนถึงขอบล่างนิดหน่อย จะได้ไม่ทันเห็นตอนมันยังจาง
      { rootMargin: "0px 0px -12% 0px", threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ease-out motion-reduce:transition-none ${
        shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } ${className}`}
      style={{ transitionDelay: shown ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
