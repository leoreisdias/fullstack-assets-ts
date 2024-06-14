// Font: https://github.com/vercel/next.js/discussions/54075

import { useRouter, usePathname } from 'next/navigation'
import { debounce } from 'lodash';

interface DataRevalidatorProps {
  /**
   * The timeout in milliseconds to wait before revalidating the data.
   */
  timeout?: number;
}

export function DataRevalidator({
  timeout = 5000,
}: DataRevalidatorProps): null {
  const router = useRouter();
  const pathname = usePathname()

  const getRefresher = useCallback(() => debounce(
    () => {
      // Can be removed, just to showcase when it triggers refresh
      console.log(
        `[${new Date().toLocaleTimeString()}] Triggering router.refresh()...`,
      );
      router.refresh();
    },
    timeout,
		{ leading: false, trailing: true }
  ), [router, timeout]);

  // Trigger router.refresh() whenever `pathname` changes.
	// Note: this does not cover searchParams, you can add `useSearchParams` if needed.
  useEffect(()=> {
		const refresher = getRefresher()
    refresher()
	}, [revalidate, pathname])

  // Trigger router.refresh() when focus goes back to the window (similar to useSWR / react-query)
  useEffect(() => {
    if(process.env.NODE_ENV === 'development') {
			return
    }

		const refresher = getRefresher()

    window.addEventListener('focus', refresher);
    return () => {
      refresher.cancel();
      window.removeEventListener('focus', refresher);
    };
  }, [revalidate]);

  return null;
}