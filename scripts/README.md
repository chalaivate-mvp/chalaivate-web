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

## อ่าน log ให้เป็น

Sandbox ที่เขียนโค้ดนี้ต่อ `openrouter.ai` / `artificialanalysis.ai` ไม่ได้ จึงทดสอบด้วย
response จำลอง **shape จริงรู้ได้จาก log บน Actions เท่านั้น** log จึงถูกออกแบบให้บอกทุกอย่าง
ที่ต้องใช้ตัดสินใจ ไม่ต้องเดา

**`field ที่จับคู่ได้:`** ตัวไหนขึ้น `ไม่พบ` script จะพิมพ์ชื่อ field จริงทั้งหมดที่ API
ส่งมาต่อท้ายให้ แยกเป็นสองกอง

- *มีค่าจริง* — เอาชื่อจากกองนี้ไปเติมใน `EVAL_ALIASES` / `INDEX_ALIASES` ที่
  `scripts/lib/sources/artificial-analysis.ts` เป็นการเติมชื่อในรายการ ไม่ต้องแก้ logic
- *มีอยู่แต่ null ทุกโมเดล* — แปลว่าเขาเลิกวัด benchmark ตัวนั้นแล้ว (ผู้ให้บริการประกาศว่า
  จะ deprecate ด้วยการปล่อยเป็น null ไม่เปลี่ยนชื่อ) กรณีนี้เติม alias ไปก็ไม่ช่วย
  ต้องถอด benchmark ตัวนั้นออกจาก `benchmarkMeta` ใน `data/model-catalog.json` แทน

**`ขาด ...` รายโมเดล** จะขึ้นเมื่อ status ยังเป็น `sample` อ่านรูปแบบการขาดเพื่อแยกสาเหตุ

| อาการ | แปลว่า | แก้ที่ |
|---|---|---|
| ขาดช่องเดียวกันทุกโมเดล | field ในแหล่งข้อมูลเปลี่ยนชื่อ | alias ใน `artificial-analysis.ts` |
| ขาดกระจุกที่บางโมเดล | slug ของโมเดลนั้นผิด | `sources.*` ใน `model-catalog.json` |
| ขาดเฉพาะช่อง OpenRouter | โมเดลนั้นยังไม่ขึ้น OpenRouter | รอ หรือแก้ slug |

## ข่าว: หนึ่งแหล่งตั้งได้หลาย url

`DEFAULT_FEEDS` แต่ละรายการมี `urls` เป็น array ไล่ลองทีละตัวจนกว่าจะได้ ตัวที่ตอบ 200
แต่ parse แล้วไม่มีข่าวสักรายการถือว่าใช้ไม่ได้ ให้ลองตัวถัดไป

**Anthropic ไม่มี RSS อย่างเป็นทางการ** — `www.anthropic.com/news/rss.xml` คืน 404
โค้ดจึงใส่ path ที่เป็นไปได้ไว้หลายตัว เผื่อวันหนึ่งเขาเปิดให้จะได้ไหลเข้าเองโดยไม่ต้องแก้โค้ด
ระหว่างนี้ข่าวมาจาก OpenAI / DeepMind / Hugging Face

ที่**ไม่ทำ**คือใช้ mirror ของบุคคลที่สาม แม้จะมีคนทำไว้หลายเจ้า เพราะข่าวจาก feed
จะถูกส่งให้ Claude แปลแล้วขึ้นหน้าเว็บทันที ถ้าต้นทางถูกแก้เนื้อหาได้ ก็เท่ากับเปิดให้คนอื่น
เขียนอะไรก็ได้ลงเว็บเรา
