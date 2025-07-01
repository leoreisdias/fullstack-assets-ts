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
import { produce } from "immer";

const EMPTY_DATA: any[] = [];
export const DataTableContext = React.createContext<{
  table: Table<any>;
  asFlex?: boolean;
} | null>(null);
// ========== HOOKS ==========
const useTableContext = (table?: Table<any>) => {
  const context = React.useContext(DataTableContext);
  if (!context && !table)
    throw new Error("useTable must be used within DataTable.Provider");

  return context ?? { table: table as Table<any>, asFlex: false };
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

  // Configuração base da tabela
  const baseTableConfig: TableOptions<T> = {
    data: safeData,
    columns,
    enableFilters: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    columnResizeMode: "onChange",
    onPaginationChange: handlePaginationChange,
    state: {
      columnPinning: {
        left: pinnedColumns?.left,
        right: pinnedColumns?.right,
      },
      pagination: pagination,
    },
    defaultColumn: {
      maxSize: 800,
      enableResizing: false,
    },
  };

  // Merge seguro usando Immer - preserva propriedades críticas
  const finalTableConfig = produce(baseTableConfig, (draft) => {
    if (config) {
      // Merge todas as propriedades do config, exceto as críticas
      Object.keys(config).forEach((key) => {
        const configKey = key as keyof TableOptions<T>;

        // Propriedades que NÃO devem ser sobrescritas pelo config
        const criticalProps = ["onPaginationChange", "state"];

        if (!criticalProps.includes(key)) {
          // @ts-ignore - Immer handles the typing complexity
          draft[configKey] = config[configKey];
        }
      });

      // Merge seguro do state, preservando pagination
      if (config.state) {
        Object.keys(config.state).forEach((stateKey) => {
          if (stateKey !== "pagination" && stateKey !== "columnPinning") {
            // @ts-ignore
            draft.state[stateKey] = config.state[stateKey];
          }
        });

        // Merge columnPinning preservando nossas configurações
        if (config.state.columnPinning && draft.state) {
          draft.state.columnPinning = {
            ...draft.state.columnPinning,
            ...config.state.columnPinning,
            // Preservar left/right se foram definidos via pinnedColumns
            ...(pinnedColumns?.left && { left: pinnedColumns.left }),
            ...(pinnedColumns?.right && { right: pinnedColumns.right }),
          };
        }
      }

      // Merge seguro do defaultColumn
      if (config.defaultColumn) {
        draft.defaultColumn = {
          ...draft.defaultColumn,
          ...config.defaultColumn,
        };
      }

      // Propriedades específicas que podem ser sobrescritas
      if (config.getRowId) {
        draft.getRowId = config.getRowId;
      }
      if (config.onRowSelectionChange) {
        draft.onRowSelectionChange = config.onRowSelectionChange;
      }
    }
  });

  const table = useReactTable(finalTableConfig);

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
