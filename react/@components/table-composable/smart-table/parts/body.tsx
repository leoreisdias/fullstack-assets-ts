"use client";
import { Row } from "@tanstack/react-table";
import * as React from "react";

import { HTMLStyledProps } from "styled-system/types";
import { AnimatePresence } from "motion/react";
import { TableBody, TableCell, TableRow } from "../../styled/table";
import { useTableContext } from "./hooks";
import { BodyRow } from "./rows-cell";
import { Skeleton } from "../../loadings/skeleton";

type DataTableBodyProps<T = any> = Omit<
  HTMLStyledProps<typeof TableBody>,
  "children"
> & {
  stripped?: boolean;
  children?: ((row: Row<T>[]) => React.ReactNode) | React.ReactNode;
  isLoading?: boolean;
};

function Body({
  stripped = true,
  children,
  isLoading,
  ...props
}: DataTableBodyProps) {
  const { table, asFlex } = useTableContext();
  const { rows } = table.getRowModel();
  const columns = table.getAllLeafColumns();

  const hasCustomRender = children !== undefined && children !== null;
  const isRenderFunction = typeof children === "function";

  if (isLoading) {
    return (
      <TableBody
        {...props}
        as={asFlex ? "div" : "tbody"}
        asFlex={asFlex ? true : false}
      >
        <Skeleton w="full" h="24" />
        <Skeleton w="full" h="24" />
        <Skeleton w="full" h="24" />
      </TableBody>
    );
  }

  return (
    <TableBody
      {...props}
      as={asFlex ? "div" : "tbody"}
      asFlex={asFlex ? true : false}
    >
      {hasCustomRender && !isRenderFunction && (
        <React.Fragment>{children}</React.Fragment>
      )}

      {hasCustomRender && isRenderFunction && (
        <AnimatePresence mode="wait">{children(rows)}</AnimatePresence>
      )}

      {!hasCustomRender && (
        <AnimatePresence mode="wait">
          {rows.map((row) => {
            return <BodyRow key={row.id} row={row} stripped={stripped} />;
          })}
        </AnimatePresence>
      )}

      {!rows?.length && (
        <TableRow as={asFlex ? "div" : "tr"} asFlex={asFlex ? true : false}>
          <TableCell
            colSpan={columns.length}
            h="24"
            textAlign="center"
            asFlex={asFlex ? true : false}
            as={asFlex ? "div" : "td"}
          >
            Sem resultados.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
}

export { Body };
