"use server";
import { HttpError } from "./errors";

type FetcherRequestInit = RequestInit & {
  query?: Record<string, unknown>;
};

function isJson(res: Response) {
  const ct = res.headers.get("content-type") ?? "";
  return ct.includes("application/json");
}

async function safeJson<T>(res: Response): Promise<T | undefined> {
  if (res.status === 204) return undefined;
  if (!isJson(res)) return undefined;
  const text = await res.text();
  if (!text) return undefined;
  return JSON.parse(text) as T;
}

export async function fetcher<T = unknown>(
  input: RequestInfo,
  init?: FetcherRequestInit
): Promise<T> {
  const accessToken = await getAccessToken(); // Example with next-auth or from cookies()
  const baseUrl = `${process.env.API_URI}${input}`;

  const res = await fetch(baseUrl, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  const body = await safeJson<any>(res);

  if (!res.ok) {
    console.error(
      "fetcher:url:",
      baseUrl,
      "init:",
      init,
      "status:",
      res.status,
      "body:",
      body
    );

    const msg = (body?.message as string) ?? `HTTP ${res.status}`;
    throw new HttpError(msg, { status: res.status, payload: body });
  }

  return body as T; // it can be undefined in 204
}
