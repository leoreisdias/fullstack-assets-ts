import { Result } from "../@types/response";

const api = axios.create()

// NOTE: USAGE TIP -ync function fetcher<T = unknown>(
  input: RequestInfo,
  init?: FetcherRequestInit<T>
): Promise<Result<null> | Result<T>> {
  // NOTE: NEXT-AUTH SESSION EXAMPLE - You can adapt to a different token approach
  // const apiToken =
  //   (await cookies()).get("authjs.session-token")?.value ||
  //   (await cookies()).get("__Secure-authjs.session-token")?.value;

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
    const data = await res.payload? Good for _queryFn_ from _useQuery_ hook (Tanstack Query)
export const clientFetcher = async <T = any>(url: string, config?: AxiosRequestConfig<T> | undefined) => {
  const res = await api.get<Result<T>>(url, {
    baseURL: "/api/internal",
    ...config,
  });

  return res?.data;
};