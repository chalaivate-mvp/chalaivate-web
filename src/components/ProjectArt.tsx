/**
 * ภาพประกอบการ์ดผลงาน — วาดด้วย SVG ไม่ใช้ไฟล์รูป
 *
 * เดิมใช้ภาพถ่าย อ.เวท ใส่ทั้งสามใบ ผลคือหน้าคนเดียวกันลอยเรียงกันสามอัน
 * และไม่ได้สื่อว่างานแต่ละชิ้นคืออะไร — ภาพประกอบควรเล่าเนื้องาน ไม่ใช่เล่าคนทำ
 *
 * ทั้งสามชิ้นใช้ระบบเดียวกันเพื่อให้เข้าชุด: viewBox 400×200, เส้นหนา 1.5,
 * พื้นหลังตารางจาง ๆ, ไล่สีน้ำเงินตาม CI และแตะไลม์เฉพาะจุดที่ต้องการให้สายตาไปหยุด
 * (CI กำหนดไลม์เป็น accent 10% ห้ามใช้ท่วมภาพ)
 *
 * ทุกชิ้นเป็นของประดับ ไม่ได้ให้ข้อมูลเพิ่มจากหัวข้อการ์ด จึงใส่ aria-hidden
 * ให้ screen reader ข้ามไปอ่านเนื้อหาแทน
 */

const BLUE = "#2486FF";
const SKY = "#48B0FF";
const DEEP = "#005CFF";
const LIME = "#D4F73F";

/** ตารางจาง ๆ ด้านหลัง ใช้ร่วมกันทั้งสามชิ้นเพื่อให้ดูเป็นชุดเดียว */
function Grid({ id }: { id: string }) {
  return (
    <>
      <defs>
        <pattern id={id} width="25" height="25" patternUnits="userSpaceOnUse">
          <path
            d="M25 0H0V25"
            fill="none"
            stroke="#FFFFFF"
            strokeOpacity="0.05"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="400" height="200" fill={`url(#${id})`} />
    </>
  );
}

/** AOT — เรดาร์ติดตามเที่ยวบิน วงกลมซ้อนพร้อมเส้นทางบินและหมุดเครื่องบิน */
function AotArt() {
  return (
    <svg viewBox="0 0 400 200" className="w-full h-full" aria-hidden="true">
      <Grid id="grid-aot" />
      {/* วงเรดาร์ */}
      {[38, 62, 86].map((r, i) => (
        <circle
          key={r}
          cx="200"
          cy="118"
          r={r}
          fill="none"
          stroke={SKY}
          strokeOpacity={0.3 - i * 0.07}
          strokeWidth="1.5"
        />
      ))}
      <circle cx="200" cy="118" r="4" fill={BLUE} />

      {/* เส้นทางบินโค้ง — เส้นประคือเส้นทางที่ยังไม่บิน */}
      <path
        d="M40 150 Q 150 40 360 92"
        fill="none"
        stroke={BLUE}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M30 96 Q 190 168 372 46"
        fill="none"
        stroke={SKY}
        strokeOpacity="0.5"
        strokeWidth="1.5"
        strokeDasharray="5 6"
        strokeLinecap="round"
      />

      {/* เครื่องบินบนเส้นทางหลัก — จุดเดียวที่ใช้ไลม์ สายตาจะไปหยุดตรงนี้ */}
      <g transform="translate(238 62) rotate(28)">
        <path
          d="M0 -9 L3 -1 L15 4 L15 7 L3 5 L1 12 L5 15 L5 17 L0 15 L-5 17 L-5 15 L-1 12 L1 5 L-13 7 L-13 4 L-3 -1 Z"
          fill={LIME}
        />
      </g>
      {/* เครื่องบินลำอื่นในระบบ */}
      <circle cx="96" cy="118" r="3.5" fill={SKY} />
      <circle cx="308" cy="140" r="3" fill={DEEP} />
      <circle cx="150" cy="66" r="2.5" fill={SKY} fillOpacity="0.7" />

      {/* แถบรันเวย์ล่าง */}
      <rect x="140" y="182" width="120" height="3" rx="1.5" fill={BLUE} fillOpacity="0.35" />
      <rect x="186" y="182" width="28" height="3" rx="1.5" fill={LIME} fillOpacity="0.8" />
    </svg>
  );
}

/** BJC — แดชบอร์ดยอดขาย กราฟแท่ง เส้น และโดนัท */
function BjcArt() {
  return (
    <svg viewBox="0 0 400 200" className="w-full h-full" aria-hidden="true">
      <Grid id="grid-bjc" />

      {/* กราฟแท่ง — แท่งสูงสุดเป็นไลม์ให้เห็นจุดพีค */}
      {[
        { x: 40, h: 42 },
        { x: 70, h: 66 },
        { x: 100, h: 54 },
        { x: 130, h: 88 },
        { x: 160, h: 72 },
      ].map((b, i) => (
        <rect
          key={b.x}
          x={b.x}
          y={150 - b.h}
          width="18"
          height={b.h}
          rx="4"
          fill={i === 3 ? LIME : BLUE}
          fillOpacity={i === 3 ? 0.95 : 0.55 + i * 0.06}
        />
      ))}
      <line x1="32" y1="152" x2="186" y2="152" stroke="#FFFFFF" strokeOpacity="0.15" strokeWidth="1.5" />

      {/* กราฟเส้นทับด้านบน */}
      <path
        d="M40 96 L70 74 L100 84 L130 48 L160 62"
        fill="none"
        stroke={SKY}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {[
        [40, 96],
        [70, 74],
        [100, 84],
        [130, 48],
        [160, 62],
      ].map(([cx, cy]) => (
        <circle key={cx} cx={cx} cy={cy} r="3" fill={SKY} />
      ))}

      {/* โดนัท — สัดส่วนยอดขาย */}
      <g transform="translate(300 100)">
        <circle r="46" fill="none" stroke="#FFFFFF" strokeOpacity="0.08" strokeWidth="18" />
        {/* stroke-dasharray บนวงกลม = ความยาวส่วนโค้ง (เส้นรอบวง ≈ 289) */}
        <circle
          r="46"
          fill="none"
          stroke={DEEP}
          strokeWidth="18"
          strokeDasharray="130 159"
          transform="rotate(-90)"
        />
        <circle
          r="46"
          fill="none"
          stroke={SKY}
          strokeWidth="18"
          strokeDasharray="78 211"
          strokeDashoffset="-130"
          transform="rotate(-90)"
        />
        <circle
          r="46"
          fill="none"
          stroke={LIME}
          strokeWidth="18"
          strokeDasharray="46 243"
          strokeDashoffset="-208"
          transform="rotate(-90)"
        />
      </g>
    </svg>
  );
}

/** กระทรวงแรงงาน — เว็บหลายไซต์ซ้อนกัน พร้อมตรามาตรฐานการเข้าถึง */
function WebArt() {
  return (
    <svg viewBox="0 0 400 200" className="w-full h-full" aria-hidden="true">
      <Grid id="grid-web" />

      {/* สองหน้าต่างด้านหลัง สื่อว่ามีหลายเว็บในระบบเดียวกัน */}
      {[
        { x: 62, y: 36, o: 0.18 },
        { x: 78, y: 50, o: 0.3 },
      ].map((w) => (
        <rect
          key={w.x}
          x={w.x}
          y={w.y}
          width="196"
          height="112"
          rx="10"
          fill="#FFFFFF"
          fillOpacity="0.03"
          stroke={SKY}
          strokeOpacity={w.o}
          strokeWidth="1.5"
        />
      ))}

      {/* หน้าต่างหลัก */}
      <g>
        <rect
          x="94"
          y="64"
          width="196"
          height="112"
          rx="10"
          fill="#0D1B2A"
          stroke={BLUE}
          strokeOpacity="0.6"
          strokeWidth="1.5"
        />
        {/* แถบหัวเบราว์เซอร์ */}
        <path
          d="M94 74a10 10 0 0110-10h176a10 10 0 0110 10v10H94z"
          fill={BLUE}
          fillOpacity="0.18"
        />
        <circle cx="107" cy="74" r="2.5" fill={SKY} fillOpacity="0.6" />
        <circle cx="116" cy="74" r="2.5" fill={SKY} fillOpacity="0.4" />
        <circle cx="125" cy="74" r="2.5" fill={SKY} fillOpacity="0.25" />

        {/* เนื้อหาในหน้า */}
        <rect x="108" y="96" width="72" height="8" rx="4" fill={SKY} fillOpacity="0.55" />
        <rect x="108" y="112" width="120" height="5" rx="2.5" fill="#FFFFFF" fillOpacity="0.18" />
        <rect x="108" y="124" width="150" height="5" rx="2.5" fill="#FFFFFF" fillOpacity="0.14" />
        <rect x="108" y="136" width="96" height="5" rx="2.5" fill="#FFFFFF" fillOpacity="0.14" />
        <rect x="108" y="152" width="46" height="12" rx="6" fill={LIME} fillOpacity="0.9" />
      </g>

      {/* ตรามาตรฐานการเข้าถึง — คนกางแขน สัญลักษณ์สากลของ accessibility */}
      <g transform="translate(324 118)">
        <circle r="30" fill={DEEP} fillOpacity="0.12" stroke={LIME} strokeOpacity="0.5" strokeWidth="1.5" />
        <circle cy="-13" r="4.5" fill={LIME} />
        <path
          d="M-13 -3 H13 M0 -6 V6 M0 6 L-8 19 M0 6 L8 19"
          stroke={LIME}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      </g>
    </svg>
  );
}

const ART = { aot: AotArt, bjc: BjcArt, web: WebArt } as const;

export type ArtKey = keyof typeof ART;

export default function ProjectArt({ name }: { name: ArtKey }) {
  const Art = ART[name];
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-navy-mid to-deep-navy">
      <Art />
    </div>
  );
}
