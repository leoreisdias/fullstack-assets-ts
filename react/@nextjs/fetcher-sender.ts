import axios, { AxiosRequestConfig } from "axios";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { Result } from "./types/response";
import { handleError } from "./errors/handleErrors";

export const fetcher = async <T = unknown>(
  input: RequestInfo,
  init: RequestInit | undefined = undefined
) => {
  // NOTE: NEXT-AUTH SESSION EXAMPLE - You can adapt to a different token approach

  //let session: Session | null = null;

  //session = await auth();

  //if (!session) session = await auth();
  // const token = session?.user.accessToken

  const baseUrl = process.env.BASE_URL; // Example, but I recommend an env variable approach

  const headers = headers(); // Based on Jack Herrington's video - pending to try it (next-auth required)

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
};

export const sender = async <T = unknown>(
  config: AxiosRequestConfig & {
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  }
) => {
  // NOTE: NEXT AUTH USAGE: Adapt for your token logic
  // let session: Session | null = null;

  // session = await auth();

  // if (!session) session = await auth();

  const cookieStore = cookies();

  const baseUrl = process.env.BASE_URL;

  const headers = headers(); // Based on Jack Herrington's video - pending to try it (next-auth required)

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
