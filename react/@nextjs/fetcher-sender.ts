import axios, { AxiosRequestConfig } from "axios";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { Result } from "../@types/response";
import { handleError } from "./errors/handleErrors";

type FetcherRequestInit<W> = RequestInit & {
  fallbackData?: W;
};

export function fetcher<T = unknown>(
  input: RequestInfo,
  init: FetcherRequestInit<T> & { fallbackData: T }
): Promise<T>;

// Sobrecarga para quando o fallbackData não é fornecido (retorno padrão de erro TResponse<null>)

export function fetcher<T = unknown>(
  input: RequestInfo,
  init?: FetcherRequestInit<T>
): Promise<Result<null> | Result<T>>;

export async function fetcher<T = unknown>(
  input: RequestInfo,
  init?: FetcherRequestInit<T>
): Promise<Result<null> | Result<T>> {
  // NOTE: NEXT-AUTH SESSION EXAMPLE - You can adapt to a different token approach
  // const apiToken =
  //   (await cookies()).get("authjs.session-token")?.value ||
  //   (await cookies()).get("__Secure-authjs.session-token")?.value;

  // const headers = headers(); // Based on Jack Herrington's video - pending to try it (next-auth required)
  
  const baseUrl = process.env.BASE_URL; // Example, but I recommend an env variable approach


  const res = await tryCatch<Response>(
    fetch(`${baseUrl}${input}`, {
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
      return redirect("/sign-out");
    }
  }

  try {
    const data = await res.payload?.json();

    return data as Result<T>;
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
    return handleError(err) as Result<T>;
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
      // Handle unauthorized response by redirecting the user.
      // Option 1: Redirect with internationalization support
      // const cookiesStore = cookies();
      // const locale = cookiesStore.get('NEXT_LOCALE');
      // return redirect(`/${locale?.value || 'pt'}/sign-out`);

      // Option 2: Simple redirect to the home page
      // return redirect("/");
      return redirect("/");
    }

    return response;
  }

  return {
    ...response,
    payload: response.payload?.data,
  };
};

export async function tryCatch<T = Result, E = Error>(
  promise: Promise<T>
): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return { payload: data, error: null, ok: true, message: "" };
  } catch (error) {
    return handleError(error) as Result<T, E>;
  }
}

// NOTE: USE THIS FOR CLIENT SIDE FETCHES SUCH IN _queryFn_ from _useQuery_ hook (Tanstack Query)
export const clientFetcher = async <T = any>(url: string, config?: AxiosRequestConfig<T> | undefined) => {
  const res = await api.get<Result<T>>(url, {
    baseURL: "/api/internal",
    ...config,
  });

  return res?.data;
};