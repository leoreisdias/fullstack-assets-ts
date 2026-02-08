// Inspired by DiceUI data-table implementation.
// Refactored and decomposed to isolate responsibilities
// such as table orchestration, pagination, and URL state.
import { useCallback, useMemo } from 'react';
import { parseAsInteger } from 'nuqs';

import { useUrlStates } from './use-url-state-nuqs';

export interface UsePaginationQueryKeys {
  /** URL param key for page. @default 'page' */
  page?: string;
  /** URL param key for pageSize. @default 'pageSize' */
  pageSize?: string;
}

export interface UsePaginationOptions {
  /** Initial page (1-indexed). @default 1 */
  initialPage?: number;
  /** Initial page size. @default 10 */
  initialPageSize?: number;
  /** Total pages available. @default 1 */
  totalPages?: number;
  /** Available page size options. @default [10, 20, 30, 40, 50] */
  pageSizeOptions?: number[];
  /** Enable URL state synchronization. @default false */
  enableUrlSync?: boolean;
  /**
   * Use cursor-based pagination instead of offset-based.
   * When enabled, `cursor` and `toParams()` will return cursor format.
   * @default false
   */
  useCursor?: boolean;
  /** Custom URL query parameter keys. Only used when enableUrlSync is true */
  queryKeys?: UsePaginationQueryKeys;
  /** Browser history mode for URL updates. @default 'replace' */
  historyMode?: 'push' | 'replace';
  /** Use shallow routing (no scroll, no full re-render). @default true */
  shallow?: boolean;
  /** Callback when page changes */
  onPageChange?: (page: number, pageSize: number) => void;
  /** Callback when page size changes */
  onPageSizeChange?: (pageSize: number) => void;
}

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50];

// NOTE: This pagination implementation was introduced during CS-Tool migration.
// It may be revised or replaced as part of the Pagination Refactor project.
/**
 * Pagination hook with optional URL sync, cursor support, and computed navigation.
 *
 * @example
 * ```tsx
 * const pagination = usePagination({ totalPages: 10, enableUrlSync: true });
 *
 * <button onClick={pagination.goToNextPage}>Next</button>
 * <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
 *
 * // Build API params
 * const params = pagination.toParams(); // { page: 2, pageSize: 10 }
 * ```
 */
export function usePagination(options: UsePaginationOptions = {}) {
  const {
    initialPage = 1,
    initialPageSize = 10,
    totalPages: totalPagesProp = 1,
    pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
    enableUrlSync = false,
    useCursor = false,
    queryKeys = {},
    historyMode = 'replace',
    shallow = true,
    onPageChange,
    onPageSizeChange,
  } = options;

  const pageKey = queryKeys.page ?? 'page';
  const pageSizeKey = queryKeys.pageSize ?? 'pageSize';

  const urlKeysMap = useMemo(
    () => ({
      [pageKey]: parseAsInteger.withDefault(initialPage),
      [pageSizeKey]: parseAsInteger.withDefault(initialPageSize),
    }),
    [pageKey, pageSizeKey, initialPage, initialPageSize]
  );

  const [urlState, setUrlState] = useUrlStates(urlKeysMap, {
    enabled: enableUrlSync,
    historyMode,
    shallow,
  });

  const currentPage = urlState[pageKey] as number;
  const pageSize = urlState[pageSizeKey] as number;

  const totalPages = Math.max(1, totalPagesProp);

  const canPreviousPage = currentPage > 1;
  const canNextPage = currentPage < totalPages;

  // Navigation Handlers
  const setPage = useCallback(
    (page: number) => {
      const validPage = Math.max(1, Math.min(page, totalPages));
      setUrlState({ [pageKey]: validPage });
      onPageChange?.(validPage, pageSize);
    },
    [totalPages, setUrlState, pageKey, onPageChange]
  );

  const setPageSize = useCallback(
    (size: number) => {
      // Batch update: reset to page 1 when page size changes
      setUrlState({
        [pageKey]: 1,
        [pageSizeKey]: size,
      });
      onPageSizeChange?.(size);
      onPageChange?.(1, size);
    },
    [setUrlState, pageKey, pageSizeKey, onPageSizeChange, onPageChange]
  );

  const goToFirstPage = useCallback(() => {
    setPage(1);
  }, [setPage]);

  const goToPreviousPage = useCallback(() => {
    if (canPreviousPage) {
      setPage(currentPage - 1);
    }
  }, [canPreviousPage, currentPage, setPage]);

  const goToNextPage = useCallback(() => {
    if (canNextPage) {
      setPage(currentPage + 1);
    }
  }, [canNextPage, currentPage, setPage]);

  const goToLastPage = useCallback(() => {
    setPage(totalPages);
  }, [setPage, totalPages]);

  const toParams = useCallback((): { page: number; pageSize: number } => {
    return {
      page: currentPage,
      pageSize,
    }
  }, [currentPage, pageSize]);

  return useMemo(
    () => ({
      currentPage,
      pageSize,
      totalPages,
      pageSizeOptions,
      canPreviousPage,
      canNextPage,
      toParams,
      goToFirstPage,
      goToPreviousPage,
      goToNextPage,
      goToLastPage,
      setPage,
      setPageSize,
    }),
    [
      currentPage,
      pageSize,
      totalPages,
      pageSizeOptions,
      canPreviousPage,
      canNextPage,
      toParams,
      goToFirstPage,
      goToPreviousPage,
      goToNextPage,
      goToLastPage,
      setPage,
      setPageSize,
    ]
  );
}
