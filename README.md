# chalaivate.com

เว็บไซต์ chalaivate.com — Next.js 16 (App Router) + Tailwind v4

- `/` หน้าโปรไฟล์
- `/artifacts/ai-models` หน้าเปรียบเทียบโมเดล AI ที่อัปเดตอัตโนมัติทุกวัน

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # ตรวจว่า production build ผ่าน
```

pipeline ที่ดึงข้อมูลโมเดลและข่าว อ่านรายละเอียดที่ `scripts/README.md`

## Deploy บน Vercel

repo นี้มี `package.json` อยู่ที่ root ตัว Vercel จะ detect Next.js ได้เอง
ตอน Import **ไม่ต้องตั้ง Root Directory** ปล่อยทุกช่องเป็น default แล้วกด Deploy ได้เลย

`vercel.json` ระบุ `framework: nextjs` ไว้ชัดเจนอีกชั้น เผื่อ auto-detect พลาด

### โดเมน

canonical ของเว็บคือ `https://www.chalaivate.com` (ตั้งไว้ที่ `src/lib/site.ts`)
ที่ Project → Settings → Domains ให้ add ทั้งสองโดเมน

- `www.chalaivate.com` → Primary
- `chalaivate.com` → Redirect to `www.chalaivate.com` (308)

`vercel.json` ใส่ redirect apex → www ไว้ให้อีกชั้นแล้ว กัน duplicate content
ถ้าตั้งค่าโดเมนบน dashboard หลุด

### environment variable

หน้าเว็บ build เป็น static ทั้งหมด **ไม่ต้องตั้ง env ใด ๆ บน Vercel**

key ทั้งสองตัวใช้เฉพาะตอน GitHub Actions ดึงข้อมูล จึงตั้งที่
`Settings → Secrets and variables → Actions` ของ repo นี้

| Secret | จำเป็นไหม | ไม่มีแล้วเป็นยังไง |
|---|---|---|
| `ARTIFICIAL_ANALYSIS_API_KEY` | ควรมี | ไม่มีคะแนน benchmark — `status` ค้างที่ `sample` ตลอด |
| `ANTHROPIC_API_KEY` | ไม่บังคับ | ข่าวยังขึ้น แต่เป็นหัวข้อภาษาอังกฤษ ไม่ได้แปลไทย |

## รูปภาพ

รูปโปรไฟล์เก็บเป็น WebP กว้าง 1400px (ไฟล์ละ 150–310 KB) ต้นฉบับ PNG ความละเอียด
3000px อยู่ที่ repo เดิม `chalaivate/chalaivate` — ถ้าจะเปลี่ยนรูปใหม่ให้ย่อก่อน commit
อย่าเอา PNG ดิบจากกล้องใส่ตรง ๆ เพราะ git เก็บทุกเวอร์ชันตลอดไป ลบทีหลังก็ไม่คืนพื้นที่
