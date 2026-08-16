import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { fetchOpenRouter, lookupOpenRouter } from "./sources/openrouter";
import { fetchArtificialAnalysis, lookupAa } from "./sources/artificial-analysis";
import {
  parseFeed,
  fetchFeeds,
  matchRelatedModels,
  type FeedSource,
} from "./sources/news";
import { mergeModels, sanityCheck, explainMissing } from "./merge";
import { Catalog, type CatalogT, type OutputDatasetT } from "./schema";
import { fetchJson, HttpError } from "./http";

/**
 * Sandbox ที่พัฒนางานนี้ถูกบล็อกไม่ให้ต่อ openrouter.ai / artificialanalysis.ai
 * จึงยิง API จริงเพื่อทดสอบไม่ได้ — เทสต์ชุดนี้ป้อน response จำลองเข้าไปแทน
 * เพื่อพิสูจน์ว่า logic แปลงหน่วย จับคู่ field และด่านตรวจทำงานถูก
 *
 * สิ่งที่เทสต์ชุดนี้ครอบ: หน่วยราคา, การจับคู่ชื่อ field ที่ไม่ตรงเป๊ะ,
 * สเกล 0-1 vs 0-100, API ล่ม, response เพี้ยน, ไม่มี API key, ด่าน sanity check
 * สิ่งที่ครอบไม่ได้: shape จริงของ API ซึ่งจะรู้จากรอบแรกที่รันบน GitHub Actions
 */

const jsonFetch = (payload: unknown, status = 200): typeof globalThis.fetch =>
  (async () =>
    new Response(JSON.stringify(payload), {
      status,
      headers: { "content-type": "application/json" },
    })) as unknown as typeof globalThis.fetch;

/* ────────────── OpenRouter ────────────── */

describe("OpenRouter", () => {
  test("แปลงราคาต่อ token เป็นราคาต่อ 1M tokens", async () => {
    const index = await fetchOpenRouter(
      jsonFetch({
        data: [
          {
            id: "anthropic/claude-opus-5",
            // API ส่งราคามาเป็น string ของ USD ต่อ 1 token
            pricing: { prompt: "0.000005", completion: "0.000025" },
            context_length: 1000000,
            top_provider: { max_completion_tokens: 128000 },
          },
        ],
      }),
    );

    const hit = lookupOpenRouter(index, "anthropic/claude-opus-5");
    assert.equal(hit?.pricing.input, 5, "input ควรเป็น $5 ต่อ 1M");
    assert.equal(hit?.pricing.output, 25, "output ควรเป็น $25 ต่อ 1M");
    assert.equal(hit?.contextWindow, 1_000_000);
    assert.equal(hit?.maxOutputTokens, 128_000);
  });

  test("จับคู่ slug แบบไม่สนตัวพิมพ์ และคืน null เมื่อไม่เจอ", async () => {
    const index = await fetchOpenRouter(
      jsonFetch({ data: [{ id: "Qwen/Qwen3.5", pricing: {}, context_length: 256000 }] }),
    );
    assert.ok(lookupOpenRouter(index, "qwen/qwen3.5"));
    assert.equal(lookupOpenRouter(index, "ไม่มีรุ่นนี้"), null);
    assert.equal(lookupOpenRouter(index, null), null);
  });

  test("ราคาหายไปกลายเป็น null ไม่ใช่ 0", async () => {
    const index = await fetchOpenRouter(
      jsonFetch({ data: [{ id: "x/y", context_length: 8000 }] }),
    );
    const hit = lookupOpenRouter(index, "x/y");
    assert.equal(hit?.pricing.input, null, "ไม่มีราคา = null ไม่ใช่ 0");
  });
});

/* ────────────── Artificial Analysis ────────────── */

describe("Artificial Analysis", () => {
  const aaPayload = (evaluations: Record<string, number>) => ({
    data: [
      {
        id: "claude-opus-5",
        slug: "claude-opus-5",
        name: "Claude Opus 5",
        evaluations,
        median_output_tokens_per_second: 55,
        median_time_to_first_token_seconds: 2.1,
      },
    ],
  });

  test("จับคู่ชื่อ field ที่ต่างจากที่คาดไว้ได้", async () => {
    const res = await fetchArtificialAnalysis(
      "test-key",
      jsonFetch(aaPayload({ gpqa_diamond: 92.6, humanitys_last_exam: 26.5 })),
    );
    const m = lookupAa(res, "claude-opus-5");
    assert.equal(m?.benchmarks.gpqa, 92.6);
    assert.equal(m?.benchmarks.hle, 26.5);
    assert.equal(res.matchedFields.gpqa, "gpqa_diamond");
  });

  test("ทน field ที่เป็น camelCase หรือมีขีดกลาง", async () => {
    const res = await fetchArtificialAnalysis(
      "k",
      jsonFetch(aaPayload({ "Humanitys-Last-Exam": 26, SciCode: 88 })),
    );
    const m = lookupAa(res, "claude-opus-5");
    assert.equal(m?.benchmarks.hle, 26);
    assert.equal(m?.benchmarks.sciCode, 88);
  });

  test("ค่าที่มาเป็นสัดส่วน 0-1 ถูกแปลงเป็นเปอร์เซ็นต์", async () => {
    const res = await fetchArtificialAnalysis("k", jsonFetch(aaPayload({ gpqa: 0.918 })));
    assert.equal(lookupAa(res, "claude-opus-5")?.benchmarks.gpqa, 91.8);
  });

  test("อ่าน index จาก top level ได้ ไม่ใช่แค่ใน evaluations", async () => {
    const res = await fetchArtificialAnalysis(
      "k",
      jsonFetch({
        data: [
          {
            slug: "m",
            name: "M",
            artificial_analysis_intelligence_index: 80,
            evaluations: {},
          },
        ],
      }),
    );
    assert.equal(lookupAa(res, "m")?.indices.intelligence, 80);
  });

  test("ไม่มี API key ต้องโยน error ไม่ใช่ยิงเปล่า", async () => {
    await assert.rejects(
      () => fetchArtificialAnalysis("", jsonFetch({ data: [] })),
      /ARTIFICIAL_ANALYSIS_API_KEY/,
    );
  });

  test("field ที่ไม่มีในทุก alias คืน null และรายงานว่าไม่พบ", async () => {
    const res = await fetchArtificialAnalysis("k", jsonFetch(aaPayload({ mmlu: 90 })));
    assert.equal(lookupAa(res, "claude-opus-5")?.benchmarks.hle, null);
    assert.equal(res.matchedFields.hle, null);
  });

  /* แยก "คลังมี" ออกจาก "โมเดลที่เราเลือกมี" — สองอย่างนี้ตอบคนละคำถาม */

  test("field ที่ค่าเป็น null ไปกอง allNull ไม่ใช่ withValues", async () => {
    const res = await fetchArtificialAnalysis(
      "k",
      jsonFetch({
        data: [
          {
            slug: "m",
            name: "M",
            evaluations: { gpqa: 80, swe_bench_verified: null },
          },
        ],
      }),
    );
    assert.ok(res.availableFields.withValues.includes("gpqa"));
    assert.ok(
      res.availableFields.allNull.includes("swe_bench_verified"),
      "field ที่มีอยู่แต่ null ต้องแยกไปอีกกอง จะได้รู้ว่าเลิกวัดไม่ใช่เปลี่ยนชื่อ",
    );
  });

  test("presentFields บอกเฉพาะของโมเดลนั้น ไม่ใช่ของทั้งคลัง", async () => {
    const res = await fetchArtificialAnalysis(
      "k",
      jsonFetch({
        data: [
          { slug: "a", name: "A", evaluations: { gpqa: 80 } },
          { slug: "b", name: "B", evaluations: { hle: 40, aime_25: 90 } },
        ],
      }),
    );
    assert.deepEqual(lookupAa(res, "a")?.presentFields, ["gpqa"]);
    assert.deepEqual(lookupAa(res, "b")?.presentFields, ["aime_25", "hle"]);
    // คลังรวมมีครบสามตัว แต่ไม่ได้แปลว่าโมเดล a มี hle
    assert.deepEqual(res.availableFields.withValues, ["aime_25", "gpqa", "hle"]);
  });
});

/* ────────────── HTTP ────────────── */

describe("HTTP", () => {
  test("ไม่ retry บน 4xx เพราะยิงซ้ำก็ไม่หาย", async () => {
    let calls = 0;
    const f = (async () => {
      calls++;
      return new Response("nope", { status: 401 });
    }) as unknown as typeof globalThis.fetch;

    await assert.rejects(() => fetchJson("https://x", { fetchImpl: f, retries: 3 }));
    assert.equal(calls, 1, "401 ต้องยิงครั้งเดียว");
  });

  test("retry บน 5xx แล้วสำเร็จในครั้งถัดไป", async () => {
    let calls = 0;
    const f = (async () => {
      calls++;
      return calls === 1
        ? new Response("boom", { status: 503 })
        : new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
    }) as unknown as typeof globalThis.fetch;

    const out = await fetchJson<{ ok: boolean }>("https://x", {
      fetchImpl: f,
      retries: 2,
    });
    assert.equal(out.ok, true);
    assert.equal(calls, 2);
  });

  test("HttpError เก็บ status code ไว้ให้ตรวจได้", async () => {
    const f = (async () => new Response("", { status: 404 })) as unknown as typeof globalThis.fetch;
    await assert.rejects(
      () => fetchJson("https://x", { fetchImpl: f, retries: 0 }),
      (err: unknown) => err instanceof HttpError && err.status === 404,
    );
  });
});

/* ────────────── RSS ────────────── */

describe("RSS", () => {
  const feed: FeedSource = { name: "Test", urls: ["u"], fallbackCategory: "product" };

  test("อ่าน RSS 2.0 และลอก HTML ออกจากคำอธิบาย", () => {
    const xml = `<?xml version="1.0"?><rss><channel>
      <item>
        <title>Claude Opus 5 released</title>
        <link>https://example.com/a</link>
        <pubDate>Fri, 14 Aug 2026 10:00:00 GMT</pubDate>
        <description>&lt;p&gt;A &lt;b&gt;big&lt;/b&gt; update&lt;/p&gt;</description>
      </item></channel></rss>`;
    const [a] = parseFeed(xml, feed);
    assert.equal(a.title, "Claude Opus 5 released");
    assert.equal(a.publishedAt, "2026-08-14");
    assert.equal(a.description, "A big update", "ต้องไม่เหลือ tag HTML");
  });

  test("อ่าน Atom ที่เก็บ URL ไว้ใน attribute", () => {
    const xml = `<?xml version="1.0"?><feed>
      <entry>
        <title>New research</title>
        <link href="https://example.com/b"/>
        <published>2026-08-13T00:00:00Z</published>
        <summary>Findings</summary>
      </entry></feed>`;
    const [a] = parseFeed(xml, feed);
    assert.equal(a.link, "https://example.com/b");
    assert.equal(a.publishedAt, "2026-08-13");
  });

  test("ข้ามรายการที่ไม่มีวันที่หรือลิงก์ แทนที่จะพัง", () => {
    const xml = `<?xml version="1.0"?><rss><channel>
      <item><title>No date</title><link>https://x/1</link></item>
      <item><title>Good</title><link>https://x/2</link><pubDate>Fri, 14 Aug 2026 10:00:00 GMT</pubDate></item>
      </channel></rss>`;
    assert.equal(parseFeed(xml, feed).length, 1);
  });

  test("XML เสียไม่ทำให้ throw", () => {
    assert.doesNotThrow(() => parseFeed("<rss><channel>", feed));
  });

  /* feed ของเจ้าใหญ่ย้าย path บ่อย จึงตั้งได้หลาย url ต่อหนึ่งแหล่ง */

  const goodRss = `<?xml version="1.0"?><rss><channel>
    <item><title>Ship it</title><link>https://x/1</link>
    <pubDate>Fri, 14 Aug 2026 10:00:00 GMT</pubDate></item></channel></rss>`;

  /** ตอบตาม url ที่ขอ — url ไหนไม่อยู่ในตารางถือว่า 404 */
  const routedFetch = (table: Record<string, string>): typeof globalThis.fetch =>
    (async (url: string) =>
      url in table
        ? new Response(table[url], { status: 200 })
        : new Response("", { status: 404 })) as unknown as typeof globalThis.fetch;

  // sinceDays กว้างมากเพื่อให้เทสต์ไม่ผูกกับวันที่ตอนรัน ไม่งั้นอีกสองสัปดาห์เทสต์จะแดงเอง
  const forever = { sinceDays: 1_000_000 };

  test("url แรกล้ม ต้องลอง url ถัดไปต่อ", async () => {
    const multi: FeedSource = {
      name: "Multi",
      urls: ["https://a/dead.xml", "https://a/live.xml"],
      fallbackCategory: "product",
    };
    const out = await fetchFeeds([multi], {
      ...forever,
      fetchImpl: routedFetch({ "https://a/live.xml": goodRss }),
    });
    assert.equal(out.length, 1);
    assert.equal(out[0].title, "Ship it");
  });

  test("url ที่ตอบ 200 แต่ไม่มีข่าวถือว่าใช้ไม่ได้ ต้องลองตัวถัดไป", async () => {
    const multi: FeedSource = {
      name: "Multi",
      urls: ["https://a/html.xml", "https://a/live.xml"],
      fallbackCategory: "product",
    };
    const out = await fetchFeeds([multi], {
      ...forever,
      fetchImpl: routedFetch({
        // หน้า HTML ปกติ ตอบ 200 แต่ parse แล้วไม่ได้ข่าวสักรายการ
        "https://a/html.xml": "<html><body>Newsroom</body></html>",
        "https://a/live.xml": goodRss,
      }),
    });
    assert.equal(out.length, 1, "ต้องไม่หยุดที่ url ที่ตอบ 200 แต่ว่างเปล่า");
  });

  test("ล้มทุก url ต้องรายงานเหตุผลของทุกตัว ไม่ใช่แค่ตัวสุดท้าย", async () => {
    const multi: FeedSource = {
      name: "Multi",
      urls: ["https://a/1.xml", "https://a/2.xml"],
      fallbackCategory: "product",
    };
    let reported = "";
    const out = await fetchFeeds([multi], {
      ...forever,
      fetchImpl: routedFetch({}),
      onError: (_f, reason) => {
        reported = reason;
      },
    });
    assert.equal(out.length, 0);
    assert.match(reported, /1\.xml/);
    assert.match(reported, /2\.xml/, "ต้องบอกด้วยว่า url ที่สองก็ล้ม");
  });

  test("จับคู่ข่าวกับโมเดลจากชื่อรุ่นและชื่อค่าย", () => {
    const models = [
      { id: "claude-opus-5", name: "Claude Opus 5", shortName: "Opus 5", vendor: "Anthropic" },
      { id: "glm-5", name: "GLM-5", shortName: "GLM-5", vendor: "Z.ai" },
    ] as CatalogT["models"];

    const hit = matchRelatedModels(
      {
        title: "Anthropic ships Claude Opus 5",
        description: "",
        link: "l",
        publishedAt: "2026-08-14",
        source: "s",
        fallbackCategory: "product",
      },
      models,
    );
    assert.deepEqual(hit, ["claude-opus-5"]);
  });
});

/* ────────────── Merge + ด่านตรวจ ────────────── */

const CATALOG: CatalogT = Catalog.parse({
  models: [
    {
      id: "m1",
      name: "Model One",
      shortName: "M1",
      vendor: "Acme",
      releaseDate: "2026-01-01",
      openWeights: false,
      license: null,
      sources: { openrouter: "acme/m1", artificialAnalysis: "m1" },
      features: {
        multimodal: true,
        toolUse: true,
        webSearch: true,
        mcp: "native",
        documentHandling: true,
        scheduling: false,
      },
      strengths: ["ก"],
      weaknesses: ["ข"],
      bestFor: ["ค"],
    },
  ],
  benchmarkMeta: [
    { key: "mmlu", label: "MMLU", description: "d", unit: "percent" },
  ],
  dataSources: [{ name: "OpenRouter", url: "https://openrouter.ai/" }],
});

const baseMerge = {
  catalog: CATALOG,
  fetchedAt: "2026-08-15T06:00:00.000Z",
  updatedAt: "2026-08-15",
  ok: [] as string[],
  failed: [] as { source: string; reason: string }[],
};

describe("merge", () => {
  test("ทุกแหล่งล่ม = ทุกค่าเป็น null และ status ยังเป็น sample", () => {
    const out = mergeModels({ ...baseMerge, openRouter: null, aa: null });
    assert.equal(out.status, "sample");
    assert.equal(out.models[0].pricing.input, null);
    assert.equal(out.models[0].benchmarks.mmlu, null);
    assert.equal(out.provenance.filled.actual, 0);
    assert.equal(out.models[0].strengths[0], "ก", "เนื้อหาไทยจาก catalog ต้องอยู่ครบ");
  });

  test("ได้ข้อมูลครบทุกช่อง = status เป็น live", () => {
    const out = mergeModels({
      ...baseMerge,
      openRouter: new Map([
        [
          "acme/m1",
          {
            contextWindow: 200000,
            maxOutputTokens: 8192,
            pricing: { input: 3, output: 15 },
          },
        ],
      ]),
      aa: {
        byKey: new Map([
          [
            "m1",
            {
              benchmarks: { mmlu: 88 },
              indices: { intelligence: 70, coding: 72 },
              presentFields: ["mmlu"],
              speed: { tokensPerSecond: 90, firstTokenSeconds: 1.2 },
            },
          ],
        ]),
        matchedFields: {},
        availableFields: { withValues: [], allNull: [] },
      },
    });
    assert.equal(out.status, "live");
    assert.equal(out.provenance.filled.actual, out.provenance.filled.expected);
    assert.deepEqual(explainMissing(out), [], "ครบแล้วต้องไม่มีรายการค้าง");
  });

  test("ได้ข้อมูลบางส่วน = ยังเป็น sample (แบนเนอร์ยังขึ้น)", () => {
    const out = mergeModels({
      ...baseMerge,
      openRouter: new Map([
        ["acme/m1", { contextWindow: 200000, maxOutputTokens: null, pricing: { input: 3, output: 15 } }],
      ]),
      aa: null,
    });
    assert.equal(out.status, "sample", "ขาด benchmark ต้องไม่ประกาศว่า live");
  });
});

/* ────────────── รายงานว่าขาดอะไร ────────────── */

describe("explainMissing", () => {
  test("บอกเป็นรายโมเดลว่าขาดช่องไหน", () => {
    const out = mergeModels({
      ...baseMerge,
      openRouter: new Map([
        [
          "acme/m1",
          { contextWindow: 200000, maxOutputTokens: null, pricing: { input: 3, output: 15 } },
        ],
      ]),
      aa: null,
    });
    const [row] = explainMissing(out);
    assert.equal(row.id, "m1");
    assert.deepEqual(row.missing, [
      "ดัชนี intelligence (AA)",
      "ความเร็ว (AA)",
      "benchmark ทุกตัว (AA)",
    ]);
    assert.ok(
      !row.missing.some((s) => s.includes("OpenRouter")),
      "ช่องที่ได้ข้อมูลแล้วต้องไม่ถูกรายงานว่าขาด",
    );
  });

  test("จำนวนช่องที่ขาดต้องตรงกับตัวเลข filled ที่ merge นับไว้", () => {
    const out = mergeModels({ ...baseMerge, openRouter: null, aa: null });
    const missingCount = explainMissing(out).reduce(
      (n, r) => n + r.missing.length,
      0,
    );
    const { actual, expected } = out.provenance.filled;
    // ถ้าสองตัวนี้ไม่ตรงกันแปลว่ารายงานกับตัวนับหลุดจากกัน แก้ที่หนึ่งลืมอีกที่
    assert.equal(missingCount, expected - actual);
  });
});

describe("sanity check", () => {
  const withPricing = (input: number, output: number): OutputDatasetT =>
    mergeModels({
      ...baseMerge,
      openRouter: new Map([
        ["acme/m1", { contextWindow: 200000, maxOutputTokens: null, pricing: { input, output } }],
      ]),
      aa: null,
    });

  test("ราคาปกติผ่าน", () => {
    assert.deepEqual(sanityCheck(withPricing(3, 15), null), []);
  });

  test("จับหน่วยราคาเพี้ยน (per-token กลายเป็น per-million)", () => {
    const problems = sanityCheck(withPricing(5_000_000, 25_000_000), null);
    assert.ok(problems.length >= 2, "ต้องรายงานทั้ง input และ output");
    assert.match(problems[0], /หน่วยอาจเพี้ยน/);
  });

  test("จับราคากระโดดเกิน 10 เท่าเทียบกับรอบก่อน", () => {
    const problems = sanityCheck(withPricing(300, 15), withPricing(3, 15));
    assert.ok(problems.some((p) => /เกิน 10 เท่า/.test(p)));
  });

  test("จับข้อมูลหายยกแผง (slug ในแหล่งข้อมูลเปลี่ยน)", () => {
    const before = mergeModels({
      ...baseMerge,
      openRouter: new Map([
        ["acme/m1", { contextWindow: 200000, maxOutputTokens: null, pricing: { input: 3, output: 15 } }],
      ]),
      aa: {
        byKey: new Map([
          ["m1", {
            benchmarks: { mmlu: 88 },
            indices: { intelligence: 70, coding: 72 },
            presentFields: ["mmlu"],
            speed: { tokensPerSecond: 90, firstTokenSeconds: 1.2 },
          }],
        ]),
        matchedFields: {},
        availableFields: { withValues: [], allNull: [] },
      },
    });
    const after = mergeModels({ ...baseMerge, openRouter: null, aa: null });
    assert.ok(sanityCheck(after, before).some((p) => /slug/.test(p)));
  });
});
