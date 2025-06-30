import React from "react";
import { HTMLStyledProps } from "styled-system/types";
import { Table } from "../../styled/table";
import { DataTableContext, useColumnSizeVars, useTableContext } from "./hooks";
import { Table as TableType } from "@tanstack/react-table";

// Provider Component
type DataTableProviderProps<T> = React.PropsWithChildren<{
  table: TableType<T>;
  asFlex?: boolean;
}>;

function Provider<T>({ children, table, asFlex }: DataTableProviderProps<T>) {
  return (
    <DataTableContext.Provider value={{ table, asFlex }}>
      {children}
    </DataTableContext.Provider>
  );
}

type DataTableRootProps = HTMLStyledProps<typeof Table>;

function Root({ children, ...props }: DataTableRootProps) {
  const { table, asFlex } = useTableContext();
  const columnSizeVars = useColumnSizeVars(table);

  return (
    <Table
      {...props}
      style={{
        ...columnSizeVars,
        minWidth: table.getTotalSize(),
      }}
      as={asFlex ? "div" : "table"}
    >
      {children}
    </Table>
  );
}

export { Provider, Root };
