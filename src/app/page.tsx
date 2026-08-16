import Image from "next/image";
import Particles from "@/components/Particles";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import OrbitalRings from "@/components/OrbitalRings";
import SectionTitle from "@/components/SectionTitle";
import CountUp from "@/components/CountUp";
import Reveal from "@/components/Reveal";
import ProjectArt from "@/components/ProjectArt";
import {
  AWARDS,
  PARTNERSHIPS,
  PROJECTS,
  STATS,
  CONTACTS,
  SPEAKER_EMAIL,
} from "@/lib/profile";

/* ───────────────────────── DATA ───────────────────────── */

const expertise = [
  {
    icon: "🤖",
    title: "AI & Machine Learning",
    desc: "พัฒนาและให้คำปรึกษาด้าน AI, Generative AI, LLM, ChatGPT และ Copilot สำหรับองค์กร",
  },
  {
    icon: "☁️",
    title: "Cloud & Azure",
    desc: "ออกแบบ Architecture บน Microsoft Azure, Cloud Migration และ DevOps Transformation",
  },
  {
    icon: "💻",
    title: "Software Development",
    desc: "Full-Stack Development ด้วย .NET, React, Next.js, Power Platform และ Modern Web Technologies",
  },
  {
    icon: "📊",
    title: "Data & Analytics",
    desc: "Power BI, Data Engineering, Business Intelligence และ Data-Driven Decision Making",
  },
  {
    icon: "🎓",
    title: "Training & Education",
    desc: "ผู้ก่อตั้ง 9Expert Training — สถาบันฝึกอบรมด้าน IT ชั้นนำของประเทศไทย",
  },
  {
    icon: "🚀",
    title: "Digital Transformation",
    desc: "ที่ปรึกษาด้าน DX สำหรับองค์กรขนาดใหญ่ ช่วยวางแผนและ Implement ระบบ Digital",
  },
];

/* เส้น path ของไอคอนช่องทางติดต่อ — เก็บเป็นตารางเพื่อไม่ให้ JSX บวม */
const ICON: Record<string, string> = {
  web: "M21 12a9 9 0 11-18 0 9 9 0 0118 0zM3.6 9h16.8M3.6 15h16.8M12 3a15 15 0 010 18a15 15 0 010-18z",
  youtube: "M21.6 7.2a2.5 2.5 0 00-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 002.4 7.2 26 26 0 002 12c0 1.6.1 3.2.4 4.8a2.5 2.5 0 001.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 001.8-1.8c.3-1.6.4-3.2.4-4.8s-.1-3.2-.4-4.8zM10 15V9l5 3-5 3z",
  facebook: "M15 3h-2.5A3.5 3.5 0 009 6.5V10H6.5v3H9v8h3v-8h2.6l.4-3H12V7a1 1 0 011-1h2V3z",
  tiktok: "M15 4v9.6a4 4 0 11-4-4c.35 0 .69.05 1 .14M15 4a5 5 0 005 5",
  mail: "M3 8l7.9 5.3a2 2 0 002.2 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
};

/* ───────────────────────── PAGE ───────────────────────── */

export default function Home() {
  return (
    <>
      <Particles />
      <Navbar />

      {/* ═══════════ HERO ═══════════ */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Cosmic gradient background */}
        <div className="absolute inset-0 bg-deep-navy">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(0,92,255,0.15)_0%,transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(72,176,255,0.10)_0%,transparent_40%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(0,92,255,0.1)_0%,transparent_50%)]" />
        </div>

        {/* Orbital rings */}
        <OrbitalRings
          size={700}
          className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-40"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-12 lg:gap-20 pt-20">
          {/* Text */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-primary/10 border border-blue-primary/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-lime-accent animate-pulse" />
              <span className="text-sm text-blue-light">
                CEO & Co-Founder, 9Expert Training
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4">
              <span className="text-white">Chalaivate</span>
              <br />
              <span className="bg-gradient-to-r from-blue-primary via-blue-light to-lime-accent bg-clip-text text-transparent">
                Pipatpannawong
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-2 font-bold">
              ชไลเวท พิพัฒพรรณวงศ์{" "}
              <span className="text-lime-accent">(อ.เวท)</span>
            </p>

            <p className="text-lg text-gray-400 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              Microsoft MVP | ผู้เชี่ยวชาญด้าน AI, Cloud & Digital
              Transformation | ผู้ก่อตั้ง 9Expert Training
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="#portfolio"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-blue-primary to-blue-dark text-white font-bold text-lg hover:shadow-lg hover:shadow-blue-primary/30 transition-all duration-300 hover:-translate-y-0.5"
              >
                ดูผลงาน
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
              <a
                href="https://www.9experttraining.com"
                target="_blank"
                rel="noopener"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-lime-accent/50 text-lime-accent font-bold text-lg hover:bg-lime-accent/10 transition-all duration-300"
              >
                ดูหลักสูตร 9Expert
              </a>
            </div>
          </div>

          {/* Hero image */}
          <div className="relative flex-shrink-0">
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[440px] lg:h-[440px]">
              {/* Glow behind image */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-primary/30 to-lime-accent/20 blur-3xl" />

              {/* Image container */}
              <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/10">
                {/* ภาพตัดพื้นหลัง (alpha) — ตอนแปลงไฟล์เติมช่องว่างเหนือหัวไว้ 10%
                   ต้นฉบับเหลือที่เหนือหัวแค่ 3% ของความสูง ครอปแบบไหนหัวก็ชนขอบวงกลม
                   object-top จึงเริ่มนับจากช่องว่างนั้น หัวเลยมีระยะหายใจ */}
                <Image
                  src="/images/chalaivate-mvp.webp"
                  alt="Chalaivate Pipatpannawong - อ.เวท"
                  fill
                  sizes="(max-width: 768px) 288px, 440px"
                  className="object-cover object-top"
                  priority
                />
              </div>

              {/* Decorative orbital ring around image */}
              <div
                className="absolute -inset-4 rounded-full border border-blue-primary/20"
                style={{ animation: "orbit 20s linear infinite" }}
              >
                <div className="absolute top-2 right-8 w-3 h-3 rounded-full bg-lime-accent shadow-lg shadow-lime-accent/50" />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs text-gray-500 tracking-widest uppercase">
            Scroll
          </span>
          <svg
            className="w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      {/* ═══════════ ABOUT ═══════════ */}
      <section id="about" className="relative py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-deep-navy via-navy-mid to-deep-navy" />
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <SectionTitle subtitle="About" title="เกี่ยวกับ อ.เวท" />

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image side */}
            <div className="relative flex justify-center">
              <div className="relative w-80 h-[440px] md:w-96 md:h-[520px]">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-primary/20 to-transparent blur-2xl" />
                <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/10">
                  <Image
                    src="/images/Aj.Chalaivate_2.webp"
                    alt="อ.เวท - Professional"
                    fill
                    className="object-cover object-top"
                  />
                </div>
                {/* Badge */}
                <div className="absolute -bottom-4 -right-4 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-primary to-blue-dark text-white font-bold shadow-xl shadow-blue-primary/30">
                  Microsoft MVP ⭐
                </div>
              </div>
            </div>

            {/* Text side */}
            <div className="space-y-6">
              <p className="text-lg text-gray-300 leading-relaxed">
                <span className="text-lime-accent font-bold">
                  ชไลเวท พิพัฒพรรณวงศ์ (อ.เวท)
                </span>{" "}
                เป็น CEO & Co-Founder ของ{" "}
                <span className="text-blue-light font-bold">9Expert Training</span>{" "}
                สถาบันฝึกอบรมด้าน IT ชั้นนำของประเทศไทย
                ที่ได้รับการรับรองจาก Microsoft
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                ด้วยประสบการณ์กว่า 15 ปีในวงการ IT อ.เวทมีความเชี่ยวชาญด้าน
                AI & Machine Learning, Cloud Architecture, Software
                Development และ Digital Transformation
                โดยได้รับการยกย่องให้เป็น{" "}
                <span className="text-lime-accent font-bold">
                  Microsoft Most Valuable Professional (MVP)
                </span>
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                อ.เวทมุ่งมั่นในการถ่ายทอดความรู้และพัฒนาบุคลากร IT
                ของประเทศไทยให้มีศักยภาพทัดเทียมระดับสากล
                ผ่านหลักสูตรที่ทันสมัยและการให้คำปรึกษาแก่องค์กรชั้นนำ
              </p>

              {/* ตัวเลขสรุปเคยอยู่ตรงนี้ด้วย แล้วหลุดจนไม่ตรงกับ section Impact
                 (ที่นี่ 10K+ ผู้เรียน ส่วนของจริง 90,000+) เก็บไว้ที่เดียวพอ */}
              <a
                href="#achievements"
                className="inline-flex items-center gap-2 text-blue-light hover:text-lime-accent transition-colors font-bold"
              >
                ดูผลลัพธ์ที่วัดได้
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ EXPERTISE ═══════════ */}
      <section id="expertise" className="relative py-24 md:py-32">
        <div className="absolute inset-0 bg-deep-navy" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-lime-accent/5 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <SectionTitle subtitle="Expertise" title="ความเชี่ยวชาญ" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {expertise.map((item, i) => (
              <div
                key={i}
                className="group p-8 rounded-3xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-blue-primary/30 transition-all duration-500 hover:-translate-y-1"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-light transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ PARTNERSHIPS + PROJECTS ═══════════ */}
      <section id="portfolio" className="relative py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-deep-navy via-navy-mid to-deep-navy" />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <SectionTitle subtitle="Partnerships" title="ความร่วมมือเชิงกลยุทธ์" />

          <div className="grid md:grid-cols-3 gap-6 mb-24">
            {PARTNERSHIPS.map((item, i) => (
              <Reveal key={item.title} delay={i * 90}>
                <div className="group h-full flex flex-col p-8 rounded-3xl bg-white/[0.03] border border-white/[0.06] hover:border-lime-accent/30 hover:bg-white/[0.05] transition-all duration-300 hover:-translate-y-1">
                  {/* แถบไลม์ด้านซ้ายคือลายเซ็นของ CI — ใช้แทนโลโก้พาร์ตเนอร์ที่เราไม่มีสิทธิ์ใช้ */}
                  <span className="inline-block w-10 h-1 rounded-full bg-lime-accent mb-5" />
                  <span className="text-xs font-bold tracking-widest uppercase text-lime-accent mb-3">
                    {item.period}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-light transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-gray mb-4">{item.org}</p>
                  <p className="text-gray-400 leading-relaxed text-sm">
                    {item.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <SectionTitle subtitle="Featured projects" title="ผลงานที่โดดเด่น" />

          <div className="grid md:grid-cols-3 gap-6">
            {PROJECTS.map((item, i) => (
              <Reveal key={item.title} delay={i * 90}>
                <div className="group h-full flex flex-col rounded-3xl overflow-hidden bg-white/[0.03] border border-white/[0.06] hover:border-blue-primary/30 hover:bg-white/[0.05] transition-all duration-300 hover:-translate-y-1">
                  <div className="relative h-44 overflow-hidden">
                    <ProjectArt name={item.art} />
                    {/* ไล่สีทับขอบล่างให้ภาพจมเข้าหาเนื้อการ์ด ไม่ให้เห็นเป็นรอยต่อแข็ง ๆ */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-deep-navy" />
                  </div>
                  <div className="flex flex-col flex-1 p-8">
                  <span className="text-xs font-bold tracking-widest uppercase text-blue-light mb-3">
                    {item.period}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-light transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-gray mb-4">{item.org}</p>
                  <p className="text-gray-400 leading-relaxed text-sm flex-1">
                    {item.desc}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-5">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full text-xs bg-blue-primary/10 text-blue-light border border-blue-primary/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ IMPACT + AWARDS ═══════════ */}
      <section id="achievements" className="relative py-24 md:py-32">
        <div className="absolute inset-0 bg-deep-navy" />
        <OrbitalRings
          size={400}
          className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <SectionTitle subtitle="Impact" title="ผลลัพธ์ที่วัดได้" />

          {/* ตัวเลขทั้งหมดเป็นผลงานของ 9Expert ที่ อ.เวทเป็นผู้ก่อตั้ง ไม่ใช่ตัวเลขส่วนบุคคล
              ต้องเขียนกำกับให้ชัด ไม่งั้นกลายเป็นเคลมผลงานองค์กรเป็นของคนคนเดียว */}
          <p className="-mt-8 mb-12 text-center text-sm text-slate-gray">
            ตัวเลขรวมของ{" "}
            <a
              href="https://www.9experttraining.com"
              target="_blank"
              rel="noopener"
              className="text-blue-light hover:text-lime-accent transition-colors"
            >
              9Expert Training
            </a>{" "}
            สถาบันที่ อ.เวทร่วมก่อตั้งและดูแลหลักสูตร
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 mb-24">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 80}>
                <div className="group h-full p-6 md:p-8 rounded-3xl bg-white/[0.03] border border-white/[0.06] hover:border-blue-sky/40 hover:bg-white/[0.06] hover:shadow-[0_0_36px_-6px_rgba(36,134,255,0.45)] transition-all duration-300 hover:-translate-y-1">
                  <CountUp
                    value={s.value}
                    suffix={s.suffix}
                    decimals={s.decimals}
                    className="block text-3xl md:text-5xl font-bold tabular-nums tracking-tight bg-gradient-to-br from-blue-brand from-20% via-blue-sky via-60% to-lime-accent bg-clip-text text-transparent"
                  />
                  <div className="text-base md:text-lg font-bold text-white mt-2">
                    {s.label}
                  </div>
                  <div className="text-xs md:text-sm text-slate-gray mt-1 leading-relaxed">
                    {s.note}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <SectionTitle subtitle="Awards & recognition" title="รางวัลและการยอมรับ" />

          <div className="max-w-4xl mx-auto divide-y divide-white/[0.07]">
            {AWARDS.map((a, i) => (
              <Reveal key={a.title} delay={i * 90}>
                <div className="group grid md:grid-cols-[minmax(0,15rem)_1fr] gap-2 md:gap-8 py-7">
                  <span className="text-xs font-bold tracking-widest uppercase text-lime-accent pt-1">
                    {a.eyebrow}
                  </span>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-light transition-colors">
                      {a.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">{a.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ SPEAKING ═══════════ */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-deep-navy via-navy-mid to-deep-navy" />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <SectionTitle subtitle="Speaking" title="วิทยากรและผู้บรรยาย" />

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg text-gray-300 leading-relaxed">
                อ.เวทเป็นวิทยากรที่ได้รับเชิญให้บรรยายในงานสัมมนาและ Conference
                ระดับประเทศอย่างสม่ำเสมอ
                ในหัวข้อที่เกี่ยวกับเทคโนโลยีสมัยใหม่ AI และ Digital
                Transformation
              </p>

              <div className="space-y-4">
                {[
                  "Microsoft Ignite Thailand",
                  "Digital Transformation Summit",
                  "AI & Machine Learning Conference",
                  "Enterprise Cloud Forum",
                  "Tech Leadership Talks",
                ].map((event) => (
                  <div
                    key={event}
                    className="flex items-center gap-3 text-gray-300"
                  >
                    <div className="w-2 h-2 rounded-full bg-lime-accent flex-shrink-0" />
                    <span>{event}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative flex justify-center">
              <div className="relative w-full max-w-md h-[400px] rounded-3xl overflow-hidden border border-white/10">
                <Image
                  src="/images/Aj.Chalaivate_4.webp"
                  alt="อ.เวท Speaking"
                  fill
                  className="object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deep-navy/80 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ CONTACT ═══════════ */}
      <section id="contact" className="relative py-24 md:py-32">
        <div className="absolute inset-0 bg-deep-navy" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(0,92,255,0.14)_0%,transparent_60%)]" />

        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <SectionTitle subtitle="Contact" title="ติดต่อ" />

          <Reveal>
            <a
              href={`mailto:${SPEAKER_EMAIL}`}
              className="group block rounded-3xl p-8 md:p-10 mb-6 bg-gradient-to-br from-blue-primary/15 to-white/[0.02] border border-blue-primary/25 hover:border-lime-accent/40 hover:shadow-[0_0_46px_-8px_rgba(36,134,255,0.5)] transition-all duration-300 hover:-translate-y-1"
            >
              <span className="text-xs font-bold tracking-widest uppercase text-lime-accent">
                เชิญเป็นวิทยากร
              </span>
              <p className="text-gray-300 mt-3 leading-relaxed">
                สนใจเชิญ อ.เวท บรรยายในงานสัมมนา อบรมภายในองค์กร
                หรือปรึกษาโครงการด้าน Data &amp; AI ติดต่อได้ที่
              </p>
              <p className="mt-4 text-xl md:text-3xl font-bold bg-gradient-to-r from-blue-brand via-blue-sky to-lime-accent bg-clip-text text-transparent break-all">
                {SPEAKER_EMAIL}
              </p>
            </a>
          </Reveal>

          <div className="grid sm:grid-cols-2 gap-5">
            {CONTACTS.map((c, i) => (
              <Reveal key={c.href} delay={i * 90}>
                <a
                  href={c.href}
                  target="_blank"
                  rel="noopener"
                  className="group flex items-center gap-4 h-full p-6 rounded-3xl bg-white/[0.03] border border-white/[0.06] hover:border-blue-sky/40 hover:bg-white/[0.06] hover:shadow-[0_0_36px_-6px_rgba(36,134,255,0.45)] transition-all duration-300 hover:-translate-y-1"
                >
                  <span className="shrink-0 w-12 h-12 rounded-2xl bg-blue-primary/15 border border-blue-primary/20 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-blue-light group-hover:text-lime-accent transition-colors"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.7}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d={ICON[c.icon]} />
                    </svg>
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm text-slate-gray">{c.label}</span>
                    <span className="block text-lg font-bold text-white truncate group-hover:text-blue-light transition-colors">
                      {c.value}
                    </span>
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
