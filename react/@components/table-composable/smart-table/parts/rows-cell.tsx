import { Cell as CellType, flexRender, Row } from "@tanstack/react-table";
import { HTMLStyledProps } from "styled-system/types";
import { useTableContext } from "./hooks";
import { TableCell, TableRow } from "../../styled/table";
import { getCommonPinningStyles } from "./helpers";
import { memo } from "react";

type DataTableRowProps = Omit<
  HTMLStyledProps<typeof TableRow>,
  "children" | "transition" | "ref"
> & {
  row: Row<any>;
  stripped?: boolean;
  animateRows?: boolean;
  children?: (cell: CellType<any, any>) => React.ReactNode;
};
type DataTableCellProps = HTMLStyledProps<typeof TableCell> & {
  cell: CellType<any, any>;
};

function Cell({ cell, ...props }: DataTableCellProps) {
  const { asFlex } = useTableContext();

  return (
    <TableCell
      borderRadius="inherit"
      as={asFlex ? "div" : "td"}
      asFlex={asFlex ? true : false}
      {...props}
      style={{
        ...getCommonPinningStyles(cell.column, false, cell.row.index),
        width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
        boxShadow: cell.column.getIsResizing()
          ? "0 0 0 1px #e2e8f0"
          : undefined,
        ...props.style,
      }}
      data-state={cell.column.getCanResize() ? "resizable" : undefined}
    >
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </TableCell>
  );
}

const BodyRowComponent = ({
  row,
  stripped,
  animateRows,
  children,
  ...rest
}: DataTableRowProps) => {
  const { table, asFlex } = useTableContext();

  const pageSize = table.getState().pagination.pageSize;
  const visibleRowIndex = row.index % pageSize;

  return (
    <>
      <TableRow
        initial="initial"
        animate="animate"
        exit="exit"
        variants={{
          initial: {
            opacity: 0,
            x: -100,
          },
          animate: () => ({
            opacity: 1,
            x: 0,
            transition: {
              duration: 0.1,
              delay: visibleRowIndex * 0.1,
              ease: "easeOut",
            },
          }),
          exit: () => ({
            opacity: 0,
            x: -100,
            transition: {
              duration: 0.2,
              delay: visibleRowIndex * 0.1,
              ease: "easeOut",
            },
          }),
        }}
        bg={
          stripped ? (row.index % 2 === 0 ? "white" : "zinc.50/50") : undefined
        }
        key={row.id}
        data-state={row.getIsSelected() && "selected"}
        expanded={row.getIsExpanded()}
        {...rest}
        as={asFlex ? "div" : "tr"}
        asFlex={asFlex ? true : false}
      >
        {row.getVisibleCells().map((cell) => {
          if (!!children) return children(cell);

          return <Cell key={cell.id} cell={cell} />;
        })}
      </TableRow>
      {row.getIsExpanded() && (
        <TableRow
          key={`${row.id}-sub`}
          expanded
          as={asFlex ? "div" : "tr"}
          className="expanded"
        >
          {row
            .getVisibleCells()
            .filter((item) => {
              return item.column.id === "expander";
            })
            .map((cell) => {
              return (
                <TableCell
                  key={`${cell.id}-sub`}
                  colSpan={table.getAllLeafColumns().length}
                  as={asFlex ? "div" : "td"}
                  asFlex={asFlex ? true : false}
                  rounded="inherit"
                >
                  {flexRender(
                    cell.column.columnDef.aggregatedCell,
                    cell.getContext()
                  )}
                </TableCell>
              );
            })}
        </TableRow>
      )}
    </>
  );
};

const BodyRowsComponent = (props: Omit<DataTableRowProps, "row">) => {
  const { table } = useTableContext();
  const { rows } = table.getRowModel();

  return (
    <>
      {rows.map((row) => {
        return <BodyRow key={row.id} row={row} {...props} />;
      })}
    </>
  );
};

const BodyRow = memo(BodyRowComponent, (prevProps, nextProps) => {
  return (
    prevProps.row.original === nextProps.row.original &&
    prevProps.stripped === nextProps.stripped &&
    prevProps.animateRows === nextProps.animateRows &&
    prevProps.row.getIsSelected() === nextProps.row.getIsSelected() &&
    prevProps.row.getIsExpanded() === nextProps.row.getIsExpanded()
  );
});

const BodyRows = memo(BodyRowsComponent, (prevProps, nextProps) => {
  return (
    prevProps.stripped === nextProps.stripped &&
    prevProps.animateRows === nextProps.animateRows
  );
});

export { BodyRow, Cell, BodyRows };
