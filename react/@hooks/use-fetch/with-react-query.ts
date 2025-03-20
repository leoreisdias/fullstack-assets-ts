import axios from "axios";
import { UseQueryOptions, useQuery } from "react-query";

import { Result } from "@/app/types/responses";
import { SortingState } from "@tanstack/react-table";

export type UseFetchQueryParams = Record<string, any> & {
  page?: number;
  sorting?: SortingState; // Tanstack table type - Adapt for your use case
};

export type UseFetchConfig<TQueryFnData = Result, TError = unknown> = Omit<
  UseQueryOptions<TQueryFnData, TError>,
  "queryKey" | "queryFn"
>;

export const useFetch = <TQueryFnData = Result, TError = unknown>(
  url: string,
  config?: {
    query?: UseFetchQueryParams;
    options?: UseFetchConfig;
  }
) => {
  const fetchData = useQuery<TQueryFnData, TError>(
    [url, config?.query],
    async ({ queryKey }) => {
      const [_key, query] = queryKey as [string, UseFetchQueryParams];

      const { data } = await axios.get<TQueryFnData>(url, {
        baseURL: "/api-front/my-api", // Route Handler Approach example -> Adapt for your Use Case
        params: query,
      });

      return data;
    },
    config?.options
  );

  return fetchData;
};
