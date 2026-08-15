# Pipeline ข้อมูล AI

ดึงข้อมูลโมเดลและข่าวสาร แล้วเขียนลง `src/data/` ให้เว็บใช้ รันอัตโนมัติวันละครั้ง
ผ่าน `.github/workflows/daily-ai-update.yml`

## รันเอง

```bash
npm run fetch:ai -- --dry   # ดึงจริงแต่ไม่เขียนไฟล์ — ใช้ดูว่าจะได้อะไร
npm run fetch:ai            # ดึงแล้วเขียนไฟล์
npx tsx --test scripts/lib/pipeline.test.ts   # เทสต์
```

## ตั้งค่า secret บน GitHub

`Settings → Secrets and variables → Actions`

| Secret | จำเป็นไหม | ไม่มีแล้วเป็นยังไง |
|---|---|---|
| `ARTIFICIAL_ANALYSIS_API_KEY` | ควรมี | ไม่มีคะแนน benchmark และดัชนี — `status` จะค้างที่ `sample` ตลอด |
| `ANTHROPIC_API_KEY` | ไม่บังคับ | ข่าวยังขึ้น แต่เป็นหัวข้อภาษาอังกฤษต้นฉบับ ไม่ได้แปลไทย |

ขอ key ของ Artificial Analysis ได้ที่ https://artificialanalysis.ai/data-api (ฟรี 1,000 req/วัน
และ**ต้องแสดง attribution** ซึ่งหน้าเว็บใส่ไว้ในส่วนแหล่งข้อมูลแล้ว)

## แหล่งข้อมูล

| แหล่ง | ให้อะไร | ต้องใช้ key |
|---|---|---|
| OpenRouter | ราคา, context window, max output | ไม่ต้อง |
| Artificial Analysis | benchmark 5 ตัว, ดัชนี 3 ตัว, ความเร็ว | ต้อง |
| RSS (Anthropic, OpenAI, DeepMind, Hugging Face) | ข่าว | ไม่ต้อง |
| Claude API | แปลและสรุปข่าวเป็นไทย | ต้อง (ไม่บังคับ) |

## โครงสร้าง

```
data/model-catalog.json      ← คนเขียน: จุดเด่น/จุดด้อยภาษาไทย, ฟีเจอร์, slug ปลายทาง
                                pipeline ไม่แตะไฟล์นี้ แก้ที่นี่เมื่อเพิ่ม/ลดโมเดล
scripts/fetch-ai-data.ts     ← entry point
scripts/lib/schema.ts        ← zod ทั้งขาเข้าและขาออก
scripts/lib/sources/*.ts     ← ตัวดึงแต่ละแหล่ง
scripts/lib/merge.ts         ← รวมข้อมูล + ด่านตรวจความสมเหตุสมผล
src/data/ai-models.json      ← pipeline เขียน (อย่าแก้มือ)
src/data/ai-news.json        ← pipeline เขียน (อย่าแก้มือ)
```

## หลักการที่โค้ดยึด

**ไม่มีข้อมูล = `null` ไม่ใช่เดา** ค่าที่ดึงไม่ได้จะเป็น `null` และหน้าเว็บแสดง "N/A"
ไม่มีการเอาค่ารอบก่อนมาใส่แทน เพราะจะกลายเป็นตัวเลขเก่าที่ดูเหมือนสด

**ล้มเหลวแบบดัง ไม่ใช่แบบเงียบ** ถ้า schema ไม่ผ่านหรือด่านตรวจไม่ผ่าน จะไม่เขียนไฟล์เลย
และ exit code ไม่เป็นศูนย์ — workflow แดง ข้อมูลเดิมยังอยู่ครบ

**`status` คำนวณจากความครบถ้วนจริง** เป็น `live` ต่อเมื่อทุกโมเดลได้ข้อมูลครบทุกช่อง
ที่ pipeline รับผิดชอบ (ราคา, context, ดัชนี, ความเร็ว, benchmark อย่างน้อย 1 ตัว)
ยังไม่ครบ = ยังเป็น `sample` แบนเนอร์เตือนบนเว็บยังขึ้น และ **Dataset JSON-LD ยังไม่ปล่อย**
ให้ search engine เพราะยังรับรองตัวเลขไม่ได้

## รอบแรกที่รันจริง — สิ่งที่ต้องดู

Sandbox ที่เขียนโค้ดนี้ต่อ `openrouter.ai` / `artificialanalysis.ai` ไม่ได้ จึงทดสอบด้วย
response จำลอง **shape จริงของ Artificial Analysis จะรู้จากรอบแรกบน Actions**

ดู log บรรทัด `field ที่จับคู่ได้:` ถ้ามีตัวไหนขึ้น `ไม่พบ` ให้เอาชื่อ field จริงจาก
response ไปเติมใน `EVAL_ALIASES` / `INDEX_ALIASES` ที่
`scripts/lib/sources/artificial-analysis.ts` — เป็นการเติมชื่อในรายการ ไม่ต้องแก้ logic

เช่นเดียวกับ slug ใน `data/model-catalog.json` (`sources.openrouter` /
`sources.artificialAnalysis`) ที่เดาไว้ก่อน ถ้าโมเดลไหนได้ข้อมูลไม่ครบให้ตรวจว่า slug ตรงกับ
ที่ปลายทางใช้จริงหรือไม่
