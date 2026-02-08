// Inspired by DiceUI data-table implementation.
// Refactored and decomposed to isolate responsibilities
// such as table orchestration, pagination, and URL state.
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type Updater,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table';
import { useMemo, useState, useCallback } from 'react';

import { getSortingStateParser } from './helpers';
import type { ExtendedColumnSort } from './types';
import type {
  UseDataTableOptions,
  UseDataTableReturn,
} from './types';

import { usePagination } from '../../../@hooks/use-pagination';
import { useUrlState } from '../../../@hooks/use-url-state-nuqs';

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50];

/**
 * A powerful React hook for managing server-side data tables with TanStack Table.
 *
 * **Key Features:**
 * - 🔄 Optional URL state synchronization (via `usePagination` + `useUrlState`)
 * - 🔌 Seamless TanStack Query integration
 * - 📄 Server-side pagination, sorting, and filtering
 * - 🎯 Type-safe and fully customizable
 * - 🔗 Shareable URLs when URL sync is enabled
 *
 * **Architecture:**
 * This hook is built on top of `usePagination` for pagination state management,
 * adding TanStack Table integration and sorting on top.
 *
 * @template TData - The type of data in each table row
 *
 * @param options - Configuration options for the table
 * @returns Table state and control methods
 *
 * @example
 * ```tsx
 * const { table, pagination, sorting } = useDataTable({
 *   columns,
 *   data: query.data?.users ?? [],
 *   pageCount: query.data?.totalPages ?? 0,
 *   enableUrlSync: true,
 * });
 *
 * // TanStack Query integration
 * const query = useQuery({
 *   queryKey: ['users', pagination.currentPage, pagination.pageSize, sorting.string],
 *   queryFn: () => fetchUsers(pagination.toParams()),
 * });
 *
 * // Navigation
 * <button onClick={pagination.goToNextPage}>Next</button>
 * ```
 *
 * @see {@link https://github.com/47ng/nuqs nuqs documentation}
 * @see {@link https://tanstack.com/table TanStack Table documentation}
 */
export function useDataTable<TData>(
  options: UseDataTableOptions<TData>
): UseDataTableReturn<TData> {
  const {
    columns,
    data,
    pageCount,
    initialPage = 1,
    initialPageSize = DEFAULT_PAGE_SIZE,
    initialSorting = [],
    columnFilters = [],
    initialRowSelection = {},
    initialColumnVisibility = {},
    pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
    enableUrlSync = false,
    queryKeys = {},
    historyMode = 'replace',
    shallow = true,
    onPaginationChange,
    onSortingChange,
    tableOptions = {},
  } = options;

  const sortKey = queryKeys.sort ?? 'sort';

  // Column IDs for sorting parser validation
  const columnIds = useMemo(
    () => new Set(columns.map((col) => col.id).filter(Boolean) as string[]),
    [columns]
  );

  // Sorting parser with column validation
  const sortingParser = useMemo(
    () => getSortingStateParser<TData>(columnIds),
    [columnIds]
  );


  const paginationState = usePagination({
    initialPage,
    initialPageSize,
    totalPages: pageCount,
    pageSizeOptions,
    enableUrlSync,
    queryKeys: {
      page: queryKeys.page,
      pageSize: queryKeys.perPage,
    },
    historyMode,
    shallow,
    onPageChange: (page, pageSize) => {
      onPaginationChange?.({ page, pageSize });
    },
    onPageSizeChange: (pageSize) => {
      onPaginationChange?.({ page: 1, pageSize });
    },
  });


  const sortingParserWithDefault = useMemo(
    () => sortingParser.withDefault(initialSorting),
    [sortingParser, initialSorting]
  );

  const [sorting, setSortingState] = useUrlState<ExtendedColumnSort<TData>[]>(
    sortKey,
    sortingParserWithDefault,
    { enabled: enableUrlSync, historyMode, shallow }
  );


  const [rowSelection, setRowSelection] =
    useState<RowSelectionState>(initialRowSelection);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    initialColumnVisibility
  );


  const pagination: PaginationState = useMemo(
    () => ({
      pageIndex: paginationState.currentPage - 1, // Convert 1-indexed to 0-indexed
      pageSize: paginationState.pageSize,
    }),
    [paginationState.currentPage, paginationState.pageSize]
  );

  // -------------------------------------------------------------------------
  // Handlers for TanStack Table
  // -------------------------------------------------------------------------

  const handlePaginationChange = useCallback(
    (updaterOrValue: Updater<PaginationState>) => {
      const newPagination =
        typeof updaterOrValue === 'function'
          ? updaterOrValue(pagination)
          : updaterOrValue;

      const newPage = newPagination.pageIndex + 1; // Convert back to 1-indexed
      const newPageSize = newPagination.pageSize;

      if (newPageSize !== paginationState.pageSize) {
        paginationState.setPageSize(newPageSize);
      } else if (newPage !== paginationState.currentPage) {
        paginationState.setPage(newPage);
      }
    },
    [pagination, paginationState]
  );

  const handleSortingChange = useCallback(
    (updaterOrValue: Updater<SortingState>) => {
      const newSorting =
        typeof updaterOrValue === 'function'
          ? updaterOrValue(sorting)
          : updaterOrValue;

      setSortingState(newSorting as ExtendedColumnSort<TData>[]);
      onSortingChange?.(newSorting);
    },
    [sorting, setSortingState, onSortingChange]
  );


  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      pagination,
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    defaultColumn: {
      enableColumnFilter: false,
      ...tableOptions.defaultColumn,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: handlePaginationChange,
    onSortingChange: handleSortingChange,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    ...tableOptions,
  });



  return useMemo(
    () => ({
      table,
      pagination: paginationState,
      sorting: { state: sorting },
      selection: { rows: rowSelection, columnVisibility },
    }),
    [
      table,
      paginationState,
      sorting,
      rowSelection,
      columnVisibility,
    ]
  );
}
