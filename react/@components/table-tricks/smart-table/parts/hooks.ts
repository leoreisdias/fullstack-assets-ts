import { debounce } from "@/utils/functions/debounce";
import {
  ColumnDef,
  ColumnPinningState,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  Table,
  TableOptions,
  useReactTable,
} from "@tanstack/react-table";
import React, { useCallback, useEffect, useMemo, useRef } from "react";

const EMPTY_DATA: any[] = [];
export const DataTableContext = React.createContext<{
  table: Table<any>;
  asFlex?: boolean;
} | null>(null);
// ========== HOOKS ==========
const useTableContext = () => {
  const context = React.useContext(DataTableContext);
  if (!context)
    throw new Error("useTable must be used within DataTable.Provider");
  return context;
};

type DataTableRef = {
  getTable: <T = any>() => Table<T>;
};

function useTableFilter<T = any>(table?: Table<T>) {
  const ref = useRef<DataTableRef | null>(null);

  // Criar a função de callback estável
  const handleFilterChange = useCallback(
    (columnId: keyof T, value: any) => {
      const tableApi = table ?? ref.current?.getTable<T>();

      tableApi?.getColumn(columnId as string)?.setFilterValue(value);

      // ativa/desativa a ordenação
      if (value) {
        tableApi?.setSorting([{ id: columnId as string, desc: false }]);
      } else {
        tableApi?.setSorting([]);
      }
    },
    [table]
  );

  // Aplicar debounce à função estável
  const debouncedOnChange = useMemo(
    () => debounce(handleFilterChange, 600),
    [handleFilterChange]
  );

  useEffect(() => {
    return () => {
      debouncedOnChange.cancel();
    };
  }, [debouncedOnChange]);

  return {
    ref,
    table: ref.current?.getTable<T>(),
    applyFilter: debouncedOnChange,
  };
}

function useTable<T = any>({
  columns,
  data,
  config,
  pageSize,
  pinnedColumns,
}: {
  data: T[];
  columns: ColumnDef<T, any>[];
  pageSize?: number;
  config?: Partial<TableOptions<T>>;
  pinnedColumns?: ColumnPinningState;
}) {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSize ?? 10,
  });

  const handlePaginationChange = React.useCallback((updaterOrValue: any) => {
    setPagination(updaterOrValue);
  }, []);

  const safeData = !data || data.length === 0 ? EMPTY_DATA : data;

  const table = useReactTable({
    data: safeData,
    columns,
    enableFilters: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowId: config?.getRowId,
    onPaginationChange: handlePaginationChange,
    onRowSelectionChange: config?.onRowSelectionChange,
    state: {
      columnPinning: {
        left: pinnedColumns?.left,
        right: pinnedColumns?.right,
      },
      pagination: pagination,
      // Mover config?.state ANTES de pagination para evitar sobrescrever
      ...config?.state,
    },
    defaultColumn: {
      maxSize: 800,
      enableResizing: false,
      ...config?.defaultColumn,
    },
    columnResizeMode: "onChange",
    ...config,
  });

  return table;
}

// Hook para column sizing variables
const useColumnSizeVars = (table: Table<any>) => {
  const { getFlatHeaders } = table;

  return React.useMemo(() => {
    const headers = getFlatHeaders();
    const colSizes: { [key: string]: number } = {};

    for (const header of headers) {
      colSizes[`--header-${header.id}-size`] = header.getSize();
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize();
    }

    return colSizes;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table.getState().columnSizingInfo, table.getState().columnSizing]);
};

export { useTableContext, useTable, useColumnSizeVars, useTableFilter };
