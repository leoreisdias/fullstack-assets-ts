import { Cell, flexRender, Header, Table } from "@tanstack/react-table";
import { useMemo } from "react";
import { getCommonPinningStyles } from './smart-table/parts/helpers';
import { HTMLStyledProps } from "styled-system/types";
import { TableResizer } from './basic/styled';

type UseTableHelperReturn = {
  tableProps: React.HTMLAttributes<HTMLTableElement>;
  tableHeadProps: (
    header: Header<any, unknown>
  ) => React.HTMLAttributes<HTMLTableCellElement>;
  resizerProps: (
    header: Header<any, unknown>
  ) => HTMLStyledProps<typeof TableResizer>;
  tableCellProps: (
    header: Cell<any, unknown>,
    rowIndex: number
  ) => React.HTMLAttributes<HTMLTableCellElement>;
};

const headChildren = (header: Header<any, unknown>) => {
  return (
    <>
      {header.isPlaceholder
        ? null
        : flexRender(header.column.columnDef.header, header.getContext())}
      <TableResizer
        className="resizer"
        hidden={!header.column.getCanResize()}
        {...{
          onDoubleClick: () => header.column.resetSize(),
          onMouseDown: header.getResizeHandler(),
          onTouchStart: header.getResizeHandler(),
        }}
        isResizing={header.column.getIsResizing()}
      />
    </>
  );
};

export const useTanstackHelper = (table: Table<any>): UseTableHelperReturn => {
  const { getFlatHeaders } = table;

  const columnSizeVars = useMemo(() => {
    const headers = getFlatHeaders();
    const colSizes: { [key: string]: number } = {};

    for (const header of headers) {
      colSizes[`--header-${header.id}-size`] = header.getSize();
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize();
    }

    return colSizes;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table.getState().columnSizingInfo, table.getState().columnSizing]);

  return {
    tableProps: {
      style: {
        ...columnSizeVars,
        minWidth: table.getTotalSize(),
      },
    },
    tableHeadProps: (header: Header<any, unknown>) => ({
      style: {
        ...getCommonPinningStyles(header.column, true, header.index),
        width: `calc(var(--header-${header?.id}-size) * 1px)`,
        position: "relative",
      },
      children: headChildren(header),
    }),
    resizerProps: (header: Header<any, unknown>) => ({
      className: "resizer",
      hidden: !header.column.getCanResize(),
      onDoubleClick: () => header.column.resetSize(),
      onMouseDown: header.getResizeHandler(),
      onTouchStart: header.getResizeHandler(),
      isResizing: header.column.getIsResizing(),
    }),
    tableCellProps: (cell: Cell<any, unknown>, rowIndex: number) => ({
      style: {
        ...getCommonPinningStyles(cell.column, false, rowIndex),
        width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
        boxShadow: cell.column.getIsResizing()
          ? "0 0 0 1px #e2e8f0"
          : undefined,
      },
      children: flexRender(cell.column.columnDef.cell, cell.getContext()),
    }),
  };
};
