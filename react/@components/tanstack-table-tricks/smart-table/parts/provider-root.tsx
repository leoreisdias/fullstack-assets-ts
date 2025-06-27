import React from "react";
import { HTMLStyledProps } from "styled-system/types";
import { Table } from "../../styled/table";
import { DataTableContext, useColumnSizeVars, useTableContext } from "./hooks";
import { Table as TableType } from "@tanstack/react-table";
import { css } from "styled-system/css";

// Provider Component
type DataTableProviderProps<T> = React.PropsWithChildren<{
  table: TableType<T>;
}>;

function Provider<T>({ table, children }: DataTableProviderProps<T>) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stableTable = React.useMemo(
    () => table,
    [table.options.data, table.options.columns]
  );

  return (
    <DataTableContext.Provider value={stableTable}>
      {children}
    </DataTableContext.Provider>
  );
}

// Root Component
type DataTableRootProps = HTMLStyledProps<typeof Table> & {
  tableProps?: React.HTMLAttributes<HTMLTableElement>;
};

function Root({ children, tableProps, ...props }: DataTableRootProps) {
  const table = useTableContext();
  const columnSizeVars = useColumnSizeVars(table);

  return (
    <Table
      {...props}
      tableProps={{
        className: css({ w: "full" }),
        style: {
          ...columnSizeVars,
          minWidth: table.getTotalSize(),
        },
        ...tableProps,
      }}
    >
      {children}
    </Table>
  );
}

export { Provider, Root };
