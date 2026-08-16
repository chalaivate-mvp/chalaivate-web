"use client";

import { useEffect, useRef, useState } from "react";

/**
 * นับเลขขึ้นตอนเลื่อนถึง — ใช้กับตัวเลขสถิติ
 *
 * นับด้วย requestAnimationFrame ไม่ใช่ setInterval เพราะ setInterval จะกระตุก
 * เมื่อเบราว์เซอร์ throttle แท็บที่ไม่ได้โฟกัส แล้วเลขจะค้างกลางทาง
 *
 * ease-out เพื่อให้พุ่งเร็วตอนต้นแล้วหน่วงตอนใกล้ถึง — อ่านค่าปลายทางได้ชัด
 * และเป็นจังหวะที่ CI เรียกว่า subtle ไม่ใช่เด้งหรือ overshoot
 *
 * เลขปลายทางต้องตรงกับค่าจริงเป๊ะ ๆ ห้ามให้ค่าที่คำนวณระหว่างทางค้างเป็นค่าสุดท้าย
 */
export default function CountUp({
  value,
  suffix = "",
  decimals = 0,
  duration = 1600,
  className = "",
}: {
  value: number;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setStarted(true);
      setShown(value);
      return;
    }

    const el = ref.current;
    if (!el) return;
    setShown(0);

    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        setStarted(true);

        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - t0) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          // ปลายทางต้องเป็น value ตรง ๆ ไม่ใช่ผลคูณที่อาจคลาดจากทศนิยมลอยตัว
          setShown(p === 1 ? value : value * eased);
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  const text = shown.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    // ค่าจริงอยู่ใน aria-label เสมอ เพื่อให้ screen reader ไม่ต้องฟังเลขวิ่ง
    <span
      ref={ref}
      className={className}
      aria-label={`${value.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}${suffix}`}
    >
      <span aria-hidden="true">
        {started ? text : "0"}
        {suffix}
      </span>
    </span>
  );
}
