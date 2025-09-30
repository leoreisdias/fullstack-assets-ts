'use server';

import axios, { AxiosRequestConfig } from "axios";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { HttpError } from "../@errors/error-helper";

type InitProps = RequestInit & { params?: Record<string, string> }

const convertObjToQueryString = (obj: Record<string, any>) => {
  return Object.entries(obj)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => {
      let valueToUse = value;

      if (typeof value === "object") {
        valueToUse = JSON.stringify(value);
      }

      if (value instanceof Date) {
        valueToUse = value.toISOString();
      }

      return `${key}=${valueToUse}`;
    })
    .join("&");
};

export async function fetcher<T = unknown>(
  input: RequestInfo,
  init?: InitProps
): Promise<T> {
  // NOTE: NEXT-AUTH SESSION EXAMPLE - You can adapt to a different token approach
  // const apiToken =
  //   (await cookies()).get("authjs.session-token")?.value ||
  //   (await cookies()).get("__Secure-authjs.session-token")?.value;

  // const headers = headers(); // Based on Jack Herrington's video - pending to try it (next-auth required)
  
  const baseUrl = process.env.BASE_URL; // Example, but I recommend an env variable approach


  const res = await tryCatch<Response>(
    fetch(`${baseUrl}${input}?${convertObjToQueryString(init?.params ?? {})}`, {
      ...init,
      headers: {
        // Authorization: `Bearer ${apiToken}`,
        ...init?.headers,
      },
    })
  );

  if (!res.ok || !res.payload.ok) {
    console.error("fetcher:url:", input, "init:", init, "res:", res);

    if (res.statusCode === 401) {
      // return Your sign-out fallback
    }
  }

  try {
    const data = await res.payload?.json();

    return data as T;
  } catch (err) {
    console.error(
      "fetcher:url:",
      `${baseUrl}${input}`,
      "init:",
      init,
      "res:",
      res,
      err
    );
    throw HttpError.fromUnknown(err);
  }
}

export const sender = async <T = unknown>(
  config: AxiosRequestConfig & {
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  }
) => {
  // NOTE: NEXT AUTH USAGE: Adapt for your token logic
  // const apiToken =
  //   (await cookies()).get("authjs.session-token")?.value ||
  //   (await cookies()).get("__Secure-authjs.session-token")?.value;

  // const headers = headers(); // Based on Jack Herrington's video - pending to try it (next-auth required)

  const cookieStore = cookies();

  const baseUrl = process.env.BASE_URL;

  const response = await tryCatch<AxiosResponse<T>>(
    axios({
      ...config,
      responseType: config.responseType,
      baseURL: baseUrl,
      headers: {
        ...config.headers,
        // Authorization: `Bearer ${apiToken}`,
      },
      params: config.params,
      timeout: 60000,
    })
  );

  if (!response.ok) {
    if (response.statusCode === 401) {
      // return Your sign-out logic
    }
  }
  
  return response.data;
};

export async function tryCatch<T = any>(
  promise: Promise<T>
): Promise<T> {
  try {
    const data = await promise;
    return data as T;
  } catch (error) {
    throw HttpError.fromUnknown(error);
  }
}
