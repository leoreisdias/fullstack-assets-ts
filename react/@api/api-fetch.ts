import { Result } from "../@types/response";

const api = axios.create()

// NOTE: USAGE TIP - Good for _queryFn_ from _useQuery_ hook (Tanstack Query)
export const clientFetcher = async <T = any>(url: string, config?: AxiosRequestConfig<T> | undefined) => {
  const res = await api.get<Result<T>>(url, {
    baseURL: "/api/internal",
    ...config,
  });

  return res?.data;
};