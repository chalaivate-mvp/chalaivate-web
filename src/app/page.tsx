import Image from "next/image";
import Particles from "@/components/Particles";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import OrbitalRings from "@/components/OrbitalRings";
import SectionTitle from "@/components/SectionTitle";

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
    desc: "ผู้ก่อตั้ง 9Expert Group — สถาบันฝึกอบรมด้าน IT ชั้นนำของประเทศไทย",
  },
  {
    icon: "🚀",
    title: "Digital Transformation",
    desc: "ที่ปรึกษาด้าน DX สำหรับองค์กรขนาดใหญ่ ช่วยวางแผนและ Implement ระบบ Digital",
  },
];

const portfolioItems = [
  {
    title: "9Expert Training Academy",
    category: "Education Platform",
    desc: "สถาบันฝึกอบรมด้าน IT ชั้นนำของไทย เปิดสอนหลักสูตร Microsoft, AI, Cloud และ Software Development มากกว่า 200 หลักสูตร",
    tags: ["Training", "Microsoft", "AI", "Cloud"],
    image: "/images/Aj.Chalaivate_3.webp",
  },
  {
    title: "Enterprise AI Consulting",
    category: "AI Solutions",
    desc: "ให้คำปรึกษาด้าน AI และ Generative AI แก่องค์กรชั้นนำ พัฒนา Custom AI Solutions, RAG Systems และ AI Agents",
    tags: ["Generative AI", "LLM", "Enterprise", "Consulting"],
    image: "/images/Aj.Chalaivate_4.webp",
  },
  {
    title: "Cloud Architecture & Migration",
    category: "Cloud Solutions",
    desc: "ออกแบบและวาง Cloud Architecture บน Microsoft Azure สำหรับองค์กรระดับ Enterprise รวมถึง Migration Strategy",
    tags: ["Azure", "Architecture", "Migration", "DevOps"],
    image: "/images/Aj.Chalaivate_2.webp",
  },
  {
    title: "Digital Transformation Programs",
    category: "DX Strategy",
    desc: "วางกลยุทธ์และ Roadmap สำหรับ Digital Transformation ขององค์กร ตั้งแต่ Assessment จนถึง Implementation",
    tags: ["Strategy", "DX", "Roadmap", "Implementation"],
    image: "/images/Aj.Chalaivate_1.webp",
  },
];

const achievements = [
  {
    number: "15+",
    label: "ปีประสบการณ์",
    desc: "ด้าน IT Training & Consulting",
  },
  {
    number: "200+",
    label: "หลักสูตร",
    desc: "ที่พัฒนาและสอนที่ 9Expert",
  },
  {
    number: "10,000+",
    label: "ผู้เรียน",
    desc: "ที่ผ่านการอบรม",
  },
  {
    number: "MVP",
    label: "Microsoft MVP",
    desc: "Most Valuable Professional",
  },
];

const certifications = [
  "Microsoft Most Valuable Professional (MVP)",
  "Microsoft Certified Trainer (MCT)",
  "Azure Solutions Architect Expert",
  "Azure AI Engineer Associate",
  "Microsoft 365 Certified",
  "Power Platform Developer",
];

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
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(255,176,32,0.08)_0%,transparent_40%)]" />
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
              <span className="w-2 h-2 rounded-full bg-amber-accent animate-pulse" />
              <span className="text-sm text-blue-light">
                CEO & Co-Founder, 9Expert Group
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4">
              <span className="text-white">Chalaivate</span>
              <br />
              <span className="bg-gradient-to-r from-blue-primary via-blue-light to-amber-accent bg-clip-text text-transparent">
                Pipatpannawong
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-2 font-bold">
              ชไลเวท พิพัฒพรรณวงศ์{" "}
              <span className="text-amber-accent">(อ.เวท)</span>
            </p>

            <p className="text-lg text-gray-400 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              Microsoft MVP | ผู้เชี่ยวชาญด้าน AI, Cloud & Digital
              Transformation | ผู้ก่อตั้ง 9Expert Group
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
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-amber-accent/50 text-amber-accent font-bold text-lg hover:bg-amber-accent/10 transition-all duration-300"
              >
                ดูหลักสูตร 9Expert
              </a>
            </div>
          </div>

          {/* Hero image */}
          <div className="relative flex-shrink-0">
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[440px] lg:h-[440px]">
              {/* Glow behind image */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-primary/30 to-amber-accent/20 blur-3xl" />

              {/* Image container */}
              <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/10">
                <Image
                  src="/images/Aj.Chalaivate_1.webp"
                  alt="Chalaivate Pipatpannawong - อ.เวท"
                  fill
                  className="object-cover object-top scale-125"
                  priority
                />
              </div>

              {/* Decorative orbital ring around image */}
              <div
                className="absolute -inset-4 rounded-full border border-blue-primary/20"
                style={{ animation: "orbit 20s linear infinite" }}
              >
                <div className="absolute top-2 right-8 w-3 h-3 rounded-full bg-amber-accent shadow-lg shadow-amber-accent/50" />
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
          <SectionTitle subtitle="About" title="เกี่ยวกับ 9Expert Training" />

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
                <span className="text-amber-accent font-bold">
                  ชไลเวท พิพัฒพรรณวงศ์ (อ.เวท)
                </span>{" "}
                เป็น CEO & Co-Founder ของ{" "}
                <span className="text-blue-light font-bold">9Expert Group</span>{" "}
                สถาบันฝึกอบรมด้าน IT ชั้นนำของประเทศไทย
                ที่ได้รับการรับรองจาก Microsoft
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                ด้วยประสบการณ์กว่า 15 ปีในวงการ IT อ.เวทมีความเชี่ยวชาญด้าน
                AI & Machine Learning, Cloud Architecture, Software
                Development และ Digital Transformation
                โดยได้รับการยกย่องให้เป็น{" "}
                <span className="text-amber-accent font-bold">
                  Microsoft Most Valuable Professional (MVP)
                </span>
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                อ.เวทมุ่งมั่นในการถ่ายทอดความรู้และพัฒนาบุคลากร IT
                ของประเทศไทยให้มีศักยภาพทัดเทียมระดับสากล
                ผ่านหลักสูตรที่ทันสมัยและการให้คำปรึกษาแก่องค์กรชั้นนำ
              </p>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                {[
                  { num: "15+", label: "ปีประสบการณ์" },
                  { num: "200+", label: "หลักสูตร" },
                  { num: "10K+", label: "ผู้เรียน" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="text-center p-4 rounded-2xl bg-white/5 border border-white/5"
                  >
                    <div className="text-2xl md:text-3xl font-bold text-blue-primary">
                      {s.num}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ EXPERTISE ═══════════ */}
      <section id="expertise" className="relative py-24 md:py-32">
        <div className="absolute inset-0 bg-deep-navy" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-accent/5 rounded-full blur-3xl" />

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

      {/* ═══════════ PORTFOLIO ═══════════ */}
      <section id="portfolio" className="relative py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-deep-navy via-navy-mid to-deep-navy" />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <SectionTitle subtitle="Portfolio" title="ผลงานที่โดดเด่น" />

          <div className="grid md:grid-cols-2 gap-8">
            {portfolioItems.map((item, i) => (
              <div
                key={i}
                className="group relative rounded-3xl overflow-hidden bg-white/[0.03] border border-white/[0.06] hover:border-blue-primary/30 transition-all duration-500"
              >
                {/* Image area */}
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-primary/20 to-deep-navy/90 z-10" />
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-accent/90 text-deep-navy">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-light transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    {item.desc}
                  </p>
                  <div className="flex flex-wrap gap-2">
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
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ ACHIEVEMENTS ═══════════ */}
      <section id="achievements" className="relative py-24 md:py-32">
        <div className="absolute inset-0 bg-deep-navy" />
        <OrbitalRings
          size={400}
          className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <SectionTitle subtitle="Achievements" title="ผลงานและรางวัล" />

          {/* Numbers */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {achievements.map((item, i) => (
              <div
                key={i}
                className="text-center p-8 rounded-3xl bg-white/[0.03] border border-white/[0.06] hover:border-blue-primary/20 transition-all"
              >
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-primary to-blue-light bg-clip-text text-transparent mb-2">
                  {item.number}
                </div>
                <div className="text-lg font-bold text-white mb-1">
                  {item.label}
                </div>
                <div className="text-sm text-gray-400">{item.desc}</div>
              </div>
            ))}
          </div>

          {/* Certifications */}
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-center text-white mb-8">
              Certifications & Awards
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {certifications.map((cert, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-primary/20 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-blue-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                      />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-300">{cert}</span>
                </div>
              ))}
            </div>
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
                    <div className="w-2 h-2 rounded-full bg-amber-accent flex-shrink-0" />
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

      <SiteFooter />
    </>
  );
}
