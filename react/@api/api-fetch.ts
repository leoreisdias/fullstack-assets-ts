import { Result } from "../@types/response";

const api = axios.create();

// NOTE: USAGE TIP - Good for _queryFn_ from _useQuery_ hook (Tanstack Query)
// NOTE: CONSIDER THAT DATA CAN BE UNDEFINED AND THE PAYLOAD FROM RESULT CAN BE NULL -> AVOID ERROR BOUNDARIES AS MUCH AS POSSIBLE

export const clientFetcher = async <T = any, W = Result<T | null>>(
  url: string,
  config?: AxiosRequestConfig<T> | undefined
) => {
  const res = await api.get<W>(url, {
    baseURL: "/api/internal",
    ...config,
  });

  return res?.data;
};
