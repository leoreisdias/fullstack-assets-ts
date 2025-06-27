"use client";
import { Row, type Table as TableType } from "@tanstack/react-table";
import * as React from "react";

import { HTMLStyledProps } from "styled-system/types";
import { AnimatePresence } from "motion/react";
import { TableBody, TableCell, TableRow } from "../../styled/table";
import { useTableContext, useTableResizing } from "./hooks";
import { BodyRow } from "./rows-cell";

type DataTableBodyProps = Omit<HTMLStyledProps<typeof TableBody>, "children"> & {
  stripped?: boolean;
  animateRows?: boolean;
  children?: (row: Array<Row<any>>) => React.ReactNode;
};

type PureTableBodyProps = {
  table: TableType<any>;
  colSpan: number;
  stripped?: boolean;
  animateRows?: boolean;
  children?: (row: Array<Row<any>>) => React.ReactNode;
} & Omit<HTMLStyledProps<typeof TableBody>, "children">;

const PureTableBody = ({ table, colSpan, stripped, animateRows, children, ...cssProps }: PureTableBodyProps) => {
  const hasCustomRender = !!children;

  return (
    <TableBody {...cssProps}>
      <AnimatePresence mode="wait">
        {hasCustomRender && children?.(table.getRowModel().rows)}

        {!hasCustomRender &&
          table.getRowModel().rows?.length &&
          table
            .getRowModel()
            .rows.map((row) => <BodyRow key={row.id} row={row} stripped={stripped} animateRows={!!animateRows} />)}

        {!table.getRowModel().rows?.length && (
          <TableRow>
            <TableCell colSpan={colSpan} h="24" textAlign="center">
              Sem resultados.
            </TableCell>
          </TableRow>
        )}
      </AnimatePresence>
    </TableBody>
  );
};

const MemoizedTableBody = React.memo(PureTableBody, (prevProps, nextProps) => {
  return prevProps.table.options.data === nextProps.table.options.data;
}) as typeof PureTableBody;

function Body({ stripped = true, animateRows = false, ...props }: DataTableBodyProps) {
  const table = useTableContext();
  const columns = table.getAllLeafColumns();
  const { isResizing } = useTableResizing(table);

  if (isResizing) {
    return (
      <MemoizedTableBody
        table={table}
        colSpan={columns.length}
        stripped={stripped}
        animateRows={animateRows}
        {...props}
      />
    );
  }

  return (
    <PureTableBody table={table} colSpan={columns.length} stripped={stripped} animateRows={animateRows} {...props} />
  );
}

export { Body };
