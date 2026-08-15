"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const sections = [
  { hash: "#hero", label: "Home" },
  { hash: "#about", label: "เกี่ยวกับ" },
  { hash: "#expertise", label: "ความเชี่ยวชาญ" },
  { hash: "#portfolio", label: "ผลงาน" },
  { hash: "#achievements", label: "รางวัล" },
];

/**
 * @param basePath  "" เมื่ออยู่หน้าแรก (ลิงก์เป็น anchor เลื่อนในหน้า)
 *                  "/" เมื่ออยู่หน้าอื่น (ต้องกลับไปหน้าแรกก่อนแล้วค่อยเลื่อน)
 */
export default function Navbar({ basePath = "" }: { basePath?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    ...sections.map((s) => ({ href: `${basePath}${s.hash}`, label: s.label })),
    { href: "/artifacts", label: "Artifacts" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-deep-navy/90 backdrop-blur-xl shadow-lg shadow-black/20 border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16 md:h-20">
        <a
          href={`${basePath}#hero`}
          aria-label="9Expert Training"
          className="flex items-center hover:opacity-80 transition-opacity"
        >
          <Image
            src="/images/9expert-logo.png"
            alt="9Expert Training"
            width={2640}
            height={935}
            priority
            className="h-7 md:h-8 w-auto"
          />
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-gray-300 hover:text-white transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-primary transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-deep-navy/95 backdrop-blur-xl border-t border-white/5">
          <div className="px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-gray-300 hover:text-white transition-colors py-2"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
