import { Cell as CellType, flexRender, Row } from "@tanstack/react-table";
import { HTMLStyledProps } from "styled-system/types";
import { useTableContext } from "./hooks";
import { TableCell, TableRow } from "../../styled/table";
import { getCommonPinningStyles } from "./helpers";

type DataTableRowProps = Omit<HTMLStyledProps<typeof TableRow>, "children"> & {
  row: Row<any>;
  stripped?: boolean;
  animateRows?: boolean;
  children?: (cell: CellType<any, any>) => React.ReactNode;
};

// Cell Component
type DataTableCellProps = HTMLStyledProps<typeof TableCell> & {
  cell: CellType<any, any>;
};

function Cell({ cell, children, ...props }: DataTableCellProps) {
  return (
    <TableCell
      {...props}
      style={{
        ...getCommonPinningStyles(cell.column, false, cell.row.index),
        width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
        boxShadow: cell.column.getIsResizing() ? "0 0 0 1px #e2e8f0" : undefined,
        ...props.style,
      }}
    >
      {children ?? flexRender(cell.column.columnDef.cell, cell.getContext())}
    </TableCell>
  );
}

const BodyRow = ({ row, stripped, animateRows, children, ...rest }: DataTableRowProps) => {
  const table = useTableContext();

  const pageSize = table.getState().pagination.pageSize;
  const visibleRowIndex = row.index % pageSize;

  if (row.getIsExpanded()) {
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
                ease: "easeInOut",
              },
            }),
            exit: () => ({
              opacity: 0,
              x: -100,
              transition: {
                duration: 0.2,
                delay: visibleRowIndex * 0.1,
                ease: "easeInOut",
              },
            }),
          }}
          bg={stripped ? (row.index % 2 === 0 ? "white" : "zinc.50/50") : undefined}
          _hover={{
            bg: "gray.100",
          }}
          key={row.id}
          data-state={row.getIsSelected() && "selected"}
          expanded={row.getIsExpanded()}
          {...rest}
        >
          {row.getVisibleCells().map((cell) => {
            if (children) return children(cell);

            return <Cell key={cell.id} cell={cell} />;
          })}
        </TableRow>
        <TableRow key={`${row.id}-sub`} expanded>
          {row
            .getVisibleCells()
            .filter((item) => {
              return item.column.id === "expander";
            })
            .map((cell) => {
              return (
                <TableCell key={`${cell.id}-sub`} colSpan={table.getAllLeafColumns().length}>
                  {flexRender(cell.column.columnDef.aggregatedCell, cell.getContext())}
                </TableCell>
              );
            })}
        </TableRow>
      </>
    );
  } else {
    return (
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
              ease: "easeInOut",
            },
          }),
          exit: () => ({
            opacity: 0,
            x: -100,
            transition: {
              duration: 0.2,
              delay: visibleRowIndex * 0.1,
              ease: "easeInOut",
            },
          }),
        }}
        bg={stripped ? (row.index % 2 === 0 ? "white" : "zinc.50/50") : undefined}
        _hover={{
          bg: "gray.100",
        }}
        key={row.id}
        data-state={row.getIsSelected() && "selected"}
        expanded={row.getIsExpanded()}
        {...rest}
      >
        {row.getVisibleCells().map((cell) => {
          if (children) return children(cell);

          return <Cell key={cell.id} cell={cell} />;
        })}
      </TableRow>
    );
  }
};

export { BodyRow, Cell };
