"use client";
import { Row } from "@tanstack/react-table";
import * as React from "react";

import { HTMLStyledProps } from "styled-system/types";
import { AnimatePresence } from "motion/react";
import { TableBody, TableCell, TableRow } from "../../styled/table";
import { useTableContext } from "./hooks";
import { BodyRow } from "./rows-cell";

type DataTableBodyProps = Omit<
  HTMLStyledProps<typeof TableBody>,
  "children"
> & {
  stripped?: boolean;
  animateRows?: boolean;
  children?: ((row: Row<any>[]) => React.ReactNode) | React.ReactNode;
};

function Body({
  stripped = true,
  animateRows = false,
  children,
  ...props
}: DataTableBodyProps) {
  const { table, asFlex } = useTableContext();
  const { rows } = table.getRowModel();
  const columns = table.getAllLeafColumns();

  const hasCustomRender = children !== undefined && children !== null;
  const isRenderFunction = typeof children === "function";

  return (
    <TableBody
      {...props}
      as={asFlex ? "div" : "tbody"}
      asFlex={asFlex ? true : false}
    >
      {hasCustomRender && !isRenderFunction && (
        <React.Fragment>{children}</React.Fragment>
      )}
      {hasCustomRender && isRenderFunction && <>{children(rows)}</>}

      <AnimatePresence mode="wait">
        {!hasCustomRender &&
          rows.map((row) => {
            return (
              <BodyRow
                key={row.id}
                row={row}
                stripped={stripped}
                animateRows={!!animateRows}
              />
            );
          })}
      </AnimatePresence>

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
