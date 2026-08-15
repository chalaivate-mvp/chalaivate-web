/**
 * ตัวห่อ fetch ที่มี timeout + retry
 *
 * เหตุผลที่ต้องมี: pipeline รันบน GitHub Actions วันละครั้ง ถ้าปลายทาง
 * ตอบช้าหรือสะดุดชั่วคราวแล้วเรายอมแพ้ทันที ข้อมูลทั้งรอบจะหายไปฟรี ๆ
 * แต่ก็ต้องไม่ retry บน 4xx เพราะ key ผิดหรือ path ผิดต่อให้ยิงกี่ครั้งก็ไม่หาย
 */
export class HttpError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export type FetchLike = typeof globalThis.fetch;

export async function fetchJson<T = unknown>(
  url: string,
  {
    headers = {},
    timeoutMs = 20_000,
    retries = 2,
    fetchImpl = globalThis.fetch,
    onRetry,
  }: {
    headers?: Record<string, string>;
    timeoutMs?: number;
    retries?: number;
    fetchImpl?: FetchLike;
    onRetry?: (attempt: number, reason: string) => void;
  } = {},
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetchImpl(url, {
        headers: { accept: "application/json", ...headers },
        signal: controller.signal,
      });

      if (!res.ok) {
        const err = new HttpError(`HTTP ${res.status} จาก ${url}`, res.status);
        // 4xx = เราผิดเอง (key ผิด/path ผิด) retry ไปก็เท่านั้น ยกเว้น 429 ที่รอแล้วหาย
        if (res.status < 500 && res.status !== 429) throw err;
        throw Object.assign(err, { retryable: true });
      }
      return (await res.json()) as T;
    } catch (err) {
      lastError = err;
      const retryable =
        (err as { retryable?: boolean }).retryable === true ||
        !(err instanceof HttpError); // network error / timeout
      if (!retryable || attempt === retries) break;
      const waitMs = 1000 * 2 ** attempt;
      onRetry?.(attempt + 1, err instanceof Error ? err.message : String(err));
      await new Promise((r) => setTimeout(r, waitMs));
    } finally {
      clearTimeout(timer);
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new HttpError(String(lastError));
}

export async function fetchText(
  url: string,
  {
    timeoutMs = 20_000,
    fetchImpl = globalThis.fetch,
  }: { timeoutMs?: number; fetchImpl?: FetchLike } = {},
): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetchImpl(url, { signal: controller.signal });
    if (!res.ok) throw new HttpError(`HTTP ${res.status} จาก ${url}`, res.status);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}
