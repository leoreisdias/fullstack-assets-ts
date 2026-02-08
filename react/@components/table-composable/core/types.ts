// Inspired by DiceUI data-table implementation.
import {
  ColumnDef,
  ColumnFiltersState,
  ColumnSort,
  Row,
  RowData,
  RowSelectionState,
  SortingState,
  TableOptions,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import type { usePagination } from '../../../@hooks/use-pagination';


declare module '@tanstack/react-table' {
  // biome-ignore lint/correctness/noUnusedVariables: TData is used in the TableMeta interface
  interface TableMeta<TData extends RowData> {
    queryKeys?: QueryKeys;
  }

  // biome-ignore lint/correctness/noUnusedVariables: TData and TValue are used in the ColumnMeta interface
  interface ColumnMeta<TData extends RowData, TValue> {
    label?: string;
    placeholder?: string;
    options?: Option[];
    range?: [number, number];
    unit?: string;
    icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  }
}

export interface QueryKeys {
  page: string;
  perPage: string;
  sort: string;
  filters: string;
  joinOperator: string;
}

export interface Option {
  label: string;
  value: string;
  count?: number;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
}

export interface ExtendedColumnSort<TData> extends Omit<ColumnSort, 'id'> {
  id: Extract<keyof TData, string>;
}

export interface ExtendedColumnFilter<TData> {
  id: Extract<keyof TData, string>;
}

export interface DataTableRowAction<TData> {
  row: Row<TData>;
  variant: 'update' | 'delete';
}



/**
 * Custom query parameter keys for URL synchronization.
 * Only used when `enableUrlSync` is `true`.
 *
 * @example
 * ```tsx
 * queryKeys: { page: 'p', perPage: 'limit', sort: 'orderBy' }
 * // URL: ?p=2&limit=20&orderBy=name.asc
 * ```
 */
export interface UseDataTableQueryKeys {
  /** @default 'page' */
  page?: string;
  /** @default 'perPage' */
  perPage?: string;
  /** @default 'sort' */
  sort?: string;
}

/**
 * Configuration options for `useDataTable`.
 * @template TData - The type of data in each table row
 */
export interface UseDataTableOptions<TData> {
  /** Column definitions for TanStack Table */
  columns: ColumnDef<TData, unknown>[];
  /** Table data (for server-side tables, pass already paginated data) */
  data: TData[];
  /** Total number of pages (required for server-side pagination) */
  pageCount: number;
  /** Initial page number (1-indexed). @default 1 */
  initialPage?: number;
  /** Initial items per page. @default 10 */
  initialPageSize?: number;
  /** Initial sorting state. @default [] */
  initialSorting?: ExtendedColumnSort<TData>[];
  /** Column filters state (controlled externally). @default [] */
  columnFilters?: ColumnFiltersState;
  /** Initial row selection state. @default {} */
  initialRowSelection?: RowSelectionState;
  /** Initial column visibility state. @default {} */
  initialColumnVisibility?: VisibilityState;
  /** Available page size options. @default [10, 20, 30, 40, 50] */
  pageSizeOptions?: number[];

  /**
   * Enable URL state synchronization for pagination and sorting.
   * Uses nuqs to sync page/pageSize/sorting to URL query params.
   *
   * When enabled, use `pagination.currentPage`, `pagination.pageSize`, `sorting.string`
   * in your queryKey and TanStack Query will auto-refetch on changes.
   *
   * @default false
   */
  enableUrlSync?: boolean;

  /** Custom URL query parameter keys. Only used with `enableUrlSync`. */
  queryKeys?: UseDataTableQueryKeys;
  /** Browser history mode for URL updates. @default 'replace' */
  historyMode?: 'push' | 'replace';
  /** Shallow routing (no scroll, no full re-render). @default true */
  shallow?: boolean;

  /** Callback fired on page or pageSize change. */
  onPaginationChange?: (pagination: { page: number; pageSize: number }) => void;
  /** Callback fired on sorting change. */
  onSortingChange?: (sorting: SortingState) => void;

  /**
   * Additional TanStack Table options.
   * @example `{ enableMultiSort: true, enableSortingRemoval: false }`
   */
  tableOptions?: Partial<
    Omit<
      TableOptions<TData>,
      'data' | 'columns' | 'pageCount' | 'state' | 'getCoreRowModel'
    >
  >;
}

/**
 * Sorting state group from `useDataTable`.
 */
export interface UseDataTableSorting {
  /** Current sorting state (TanStack format: `[{ id, desc }]`). */
  state: SortingState;
  /** Sorting as API string (e.g. `"name:asc"`) or `undefined`. */
  string: string | undefined;
}

/**
 * Selection & visibility state group from `useDataTable`.
 */
export interface UseDataTableSelection {
  /** Row selection state. Maps row IDs to `true`. */
  rows: RowSelectionState;
  /** Column visibility state. Maps column IDs to `false` for hidden. */
  columnVisibility: VisibilityState;
}

/**
 * Return value from `useDataTable`.
 *
 * Grouped by concern for clarity:
 * - `table` - TanStack Table instance
 * - `pagination` - Page state + navigation actions (from `usePagination`)
 * - `sorting` - Sort state + API string
 * - `selection` - Row selection + column visibility
 *
 * @template TData - The type of data in each table row
 *
 * @example
 * ```tsx
 * const { table, pagination, sorting } = useDataTable(opts);
 *
 * // TanStack Query integration
 * const { data } = useQuery({
 *   queryKey: ['users', pagination.currentPage, pagination.pageSize, sorting.string],
 *   queryFn: () => fetchUsers(pagination.toParams()),
 * });
 *
 * // Navigation
 * <button onClick={pagination.goToNextPage}>Next</button>
 * <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
 * ```
 */
export interface UseDataTableReturn<TData> {
  /** TanStack Table instance. Pass this to `<DataTable>`. */
  table: ReturnType<typeof useReactTable<TData>>;
  /** Pagination state and navigation actions (from `usePagination`). */
  pagination: ReturnType<typeof usePagination>;
  /** Sorting state and API string. */
  sorting: UseDataTableSorting;
  /** Row selection and column visibility state. */
  selection: UseDataTableSelection;
}
