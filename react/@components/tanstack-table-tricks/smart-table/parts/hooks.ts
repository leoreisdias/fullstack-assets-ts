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

export const DataTableContext = React.createContext<Table<any> | null>(null);

// ========== HOOKS ==========
const useTableContext = () => {
  const table = React.useContext(DataTableContext);
  if (!table) throw new Error("useTable must be used within DataTable.Provider");
  return table;
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
    [table],
  );

  // Aplicar debounce à função estável
  const debouncedOnChange = useMemo(() => debounce(handleFilterChange, 600), [handleFilterChange]);

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

function useTable<T>({
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

  const table = useReactTable({
    data,
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
      ...config?.defaultColumn,
    },
    columnResizeMode: "onChange",
    // Separar propriedades que podem conflitar
    ...(config && {
      ...config,
      // Garantir que essas propriedades não sejam sobrescritas
      onPaginationChange: handlePaginationChange,
      state: {
        columnPinning: {
          left: pinnedColumns?.left,
          right: pinnedColumns?.right,
        },
        pagination: pagination,
        ...config?.state,
      },
    }),
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

// Hook para resizing logic
const useTableResizing = (table: Table<any>) => {
  const columnSizeVars = useColumnSizeVars(table);

  return React.useMemo(() => {
    return {
      isResizing: table.getState().columnSizingInfo.isResizingColumn,
      columnSizeVars,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table.getState().columnSizingInfo.isResizingColumn, columnSizeVars]);
};

export { useTableContext, useTable, useColumnSizeVars, useTableResizing, useTableFilter };
