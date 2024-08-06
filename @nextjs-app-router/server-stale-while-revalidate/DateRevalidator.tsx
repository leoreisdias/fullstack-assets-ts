"use client";
// Font: https://github.com/vercel/next.js/discussions/54075

import { debounce } from "./debounce";
import { useRouter, usePathname } from "next/navigation";
import { useCallback, useEffect } from "react";

interface DataRevalidatorProps {
  /**
   * The timeout in milliseconds to wait before revalidating the data.
   */
  timeout?: number;

  /**
   * The interval in milliseconds to revalidate the data.
   */
  revalidateInterval?: number;
}

export function DataRevalidator({ timeout = 2000, revalidateInterval }: DataRevalidatorProps): null {
  const router = useRouter();
  const pathname = usePathname();

  const getRefresher = useCallback(
    () =>
      debounce(
        () => {
          // Can be removed, just to showcase when it triggers refresh
          console.info(`[${new Date().toLocaleTimeString()}] Triggering refresh...`);
          router.refresh();
        },
        timeout,
        { leading: false, trailing: true },
      ),
    [router, timeout],
  );

  // Trigger router.refresh() whenever `pathname` changes.
  // Note: this does not cover searchParams, you can add `useSearchParams` if needed.
  useEffect(() => {
    const refresher = getRefresher();
    refresher();
  }, [pathname, getRefresher]);

  // Trigger router.refresh() when focus goes back to the window (similar to useSWR / react-query)
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      return;
    }

    const refresher = getRefresher();

    window.addEventListener("focus", refresher);
    return () => {
      refresher.cancel();
      window.removeEventListener("focus", refresher);
    };
  }, [getRefresher]);

  // Trigger router.refresh() at a fixed interval
  useEffect(() => {
    if (!revalidateInterval) {
      return;
    }

    const refresher = getRefresher();

    const interval = setInterval(refresher, revalidateInterval);
    return () => {
      clearInterval(interval);
    };
  }, [revalidateInterval, getRefresher]);

  return null;
}
