/**
 * This file provides a detailed implementation of a wrapper component for the TanStack Table library,
 * offering a highly customizable and performant data table solution. The `DataTable` component is designed
 * to integrate seamlessly with TanStack Table's powerful features while adding additional functionality
 * and abstractions for ease of use. Below is a detailed breakdown of the file's purpose and key features:
 *
 * ## Purpose
 * The `DataTable` component serves as a wrapper around the TanStack Table library, providing:
 * - Declarative API for table configuration and state management.
 * - Support for advanced features such as column resizing, pinned columns, and expandable sub-rows.
 * - Integration with PandaCSS for styling and composable table components from the `headless.tsx` file.
 * - Performance optimizations using memoization, debouncing, and efficient rendering techniques.
 * - A helper hook (`useDataTable`) for managing table state and applying filters programmatically.
 *
 * ## Key Features
 *
 * ### 1. Declarative API with `useImperativeHandle`
 * The `DataTable` component exposes its internal table instance via a `ref` using `useImperativeHandle`.
 * This allows external components to interact with the table's state and methods declaratively, such as
 * accessing the table instance or applying filters programmatically.
 *
 * ### 2. Advanced Filtering with Debounced Updates
 * The `useDataTable` hook provides a utility method (`applyFilter`) for applying filters to the table.
 * This method is debounced using a custom `debounce` utility, ensuring that filter updates are applied
 * efficiently without excessive re-renders. The hook also leverages `useCallback` and `useMemo` for
 * stable and performant function references.
 *
 * ### 3. Expandable Rows and Sub-Rows
 * The `CustomRow` component supports expandable rows, allowing for nested sub-rows to be displayed
 * dynamically. This is particularly useful for hierarchical data structures or when additional details
 * need to be shown on demand.
 *
 * ### 4. Column Resizing and Pinning
 * The table supports column resizing with a smooth and performant user experience. Resizing is handled
 * using TanStack Table's `columnResizeMode` and custom styles for the resizer. Additionally, columns
 * can be pinned to the left or right, with sticky positioning and visual cues for pinned columns.
 *
 * ### 5. Styling with PandaCSS
 * The component uses PandaCSS for styling, leveraging its composable and declarative approach to define
 * styles. The `Table`, `TableHeader`, `TableBody`, and other sub-components are styled using PandaCSS's
 * `styled` and `css` utilities, ensuring a consistent and maintainable design system.
 *
 * ### 6. Pagination Support
 * The `DataTablePagination` component is integrated to provide pagination controls. Pagination state
 * is managed internally using TanStack Table's `onPaginationChange` and `PaginationState`.
 *
 * ### 7. Performance Optimizations
 * - **Memoized Styles:** Column size variables and pinning styles are memoized to avoid unnecessary
 *   recalculations and improve rendering performance.
 * - **Conditional Rendering:** The table body switches between a memoized version (`MemoizedTableBody`)
 *   and a non-memoized version based on the resizing state, ensuring optimal rendering behavior.
 * - **AnimatePresence:** The `motion` library is used for animating row transitions, enhancing the
 *   user experience with smooth animations for row additions and deletions.
 *
 * ## Helper Hook: `useDataTable`
 * The `useDataTable` hook simplifies the integration of the `DataTable` component by:
 * - Providing a `ref` to access the table instance.
 * - Offering a debounced `applyFilter` method for programmatically applying filters.
 * - Automatically cleaning up the debounced function on unmount to prevent memory leaks.
 *
 * ## Insights and Recommendations
 * - **Extensibility:** The component is highly extensible, allowing developers to customize its behavior
 *   and appearance through props such as `columns`, `data`, `innerStyle`, and `config`.
 * - **Reusability:** The use of composable sub-components (`Table`, `TableHeader`, `TableBody`, etc.)
 *   promotes reusability and separation of concerns.
 * - **Performance:** The combination of memoization, debouncing, and efficient rendering techniques
 *   ensures that the component performs well even with large datasets.
 * - **Accessibility:** Consider adding ARIA attributes and keyboard navigation support to improve
 *   accessibility for users with assistive technologies.
 *
 * ## Dependencies
 * - **TanStack Table:** Provides the core table functionality, including sorting, filtering, pagination,
 *   and column resizing.
 * - **PandaCSS:** Used for styling the table and its sub-components.
 * - **motion/react:** Enables animations for row transitions.
 * - **styled-system:** Provides utilities for defining styles and tokens.
 *
 * ## Conclusion
 * This file demonstrates a robust and feature-rich implementation of a data table component, combining
 * the power of TanStack Table with additional abstractions and utilities for enhanced usability and
 * performance. It serves as an excellent example of how to build a highly customizable and performant
 * table component for modern React applications.
 */
"use client";

import {
  Column,
  ColumnDef,
  ColumnPinningState,
  PaginationState,
  Row,
  TableOptions,
  Table as TableType,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../headless";
import {
  CSSProperties,
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Box, Flex, styled } from "styled-system/jsx";
import { HTMLStyledProps, SystemStyleObject } from "styled-system/types";
import { DataTablePagination } from "./pagination";
import { css } from "styled-system/css";
import { AnimatePresence, motion } from "motion/react";
import { token } from "styled-system/tokens";
import { debounce } from "@/utils/functions/debounce";

type DataTableProps = HTMLStyledProps<typeof Table> & {
  id?: string;
  columns: ColumnDef<any, any>[];
  data: Record<string, any>[];
  css?: SystemStyleObject;
  hidePagination?: boolean;
  innerStyle?: {
    tableHeader?: SystemStyleObject;
    tableBody?: SystemStyleObject;
  };
  pageSize?: number;
  pinnedColumns?: ColumnPinningState;
  stripped?: boolean;
  config?: Partial<TableOptions<any>>;
};

type DataTableRef = {
  getTable: <T = any>() => TableType<T>;
};

// const DEFAULT_SIZE = 150;

const getCommonPinningStyles = (
  column: Column<any>,
  isHeader?: boolean,
  index = 0
): CSSProperties | Record<any, any> => {
  const isPinned = column.getIsPinned();
  // const isLastLeftPinnedColumn = isPinned === "left" && column.getIsLastColumn("left");
  // const isFirstRightPinnedColumn = isPinned === "right" && column.getIsFirstColumn("right");

  if (!column.getIsVisible()) return {};

  const strippedColor = index % 2 === 0 ? "white" : token("colors.gray.50");

  return {
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
    opacity: isPinned ? 0.95 : 1,
    position: isPinned ? "sticky" : undefined,
    // width: column.getSize() === DEFAULT_SIZE ? undefined : column.getSize(),
    background: isPinned
      ? isHeader
        ? "#f6f6f8"
        : strippedColor
      : "transparent",
    zIndex: isPinned ? 1 : 0,
  };
};

const Resizer = styled("div", {
  base: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    height: "50%",
    right: 0,
    width: "4px",
    rounded: "full",
    background: "rgba(85, 85, 85, 0.24)",
    cursor: "col-resize",
    userSelect: "none",
    touchAction: "none",
  },
  variants: {
    isResizing: {
      true: {
        background: "primary.6",
        opacity: 1,
      },
    },
  },
});

export const DataTable = forwardRef<DataTableRef, DataTableProps>(
  (
    {
      columns,
      data,
      css: wrapperCssProps,
      hidePagination,
      innerStyle,
      pageSize,
      pinnedColumns,
      stripped = true,
      config,
      ...rest
    }: DataTableProps,
    ref
  ) => {
    const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: pageSize || 10,
    });

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
      onPaginationChange: setPagination,
      onRowSelectionChange: config?.onRowSelectionChange,
      state: {
        columnPinning: {
          left: pinnedColumns?.left,
          right: pinnedColumns?.right,
        },
        pagination: pagination,
        ...config?.state,
      },
      defaultColumn: {
        maxSize: 800,

        ...config?.defaultColumn,
      },
      columnResizeMode: "onChange",
    });

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

    useImperativeHandle(
      ref,
      () => ({
        getTable: () => table,
      }),
      [table]
    );

    return (
      <Flex
        flexDir="column"
        gap={4}
        w="full"
        overflowX="auto"
        fontSize="sm"
        css={wrapperCssProps}
      >
        <Table id="table-box" {...rest} alignSelf="center">
          <table
            className={css({ w: "full" })}
            style={{
              ...columnSizeVars,
              minWidth: table.getTotalSize(), // FIXME: THIS ONE MIGHT AFFECT RESIZING FEELING
            }}
          >
            <TableHeader
              css={{
                ...innerStyle?.tableHeader,
                "& .resizer": {
                  opacity: 0,
                },
              }}
            >
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        style={{
                          ...getCommonPinningStyles(
                            header.column,
                            true,
                            header.index
                          ),
                          width: `calc(var(--header-${header?.id}-size) * 1px)`,
                        }}
                        position="relative"
                        css={{
                          "&:hover .resizer": {
                            opacity: 1,
                          },
                        }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        {header.column.getCanResize() && (
                          <Resizer
                            className="resizer"
                            {...{
                              onDoubleClick: () => header.column.resetSize(),
                              onMouseDown: header.getResizeHandler(),
                              onTouchStart: header.getResizeHandler(),
                            }}
                            isResizing={header.column.getIsResizing()}
                          />
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            {table.getState().columnSizingInfo.isResizingColumn ? (
              <MemoizedTableBody
                table={table}
                colSpan={columns.length}
                tableBody={innerStyle?.tableBody}
              />
            ) : (
              <Body
                table={table}
                colSpan={columns.length}
                tableBody={innerStyle?.tableBody}
                stripped={stripped}
              />
            )}
          </table>
        </Table>
        <Box py="4" hidden={hidePagination}>
          <DataTablePagination table={table} count={data.length} />
        </Box>
      </Flex>
    );
  }
);

const MotionRow = motion.create(TableRow);

const CustomRow = ({
  row,
  table,
  stripped,
}: {
  row: Row<any>;
  table: TableType<any>;
  stripped?: boolean;
}) => {
  const renderedRow = (
    <MotionRow
      exit={{
        opacity: 0,
        scale: 0.8,
        backgroundColor: "#dcfdbc",
        transition: {
          duration: 0.3,
          type: "spring",
          bounce: 0.4,
        },
      }}
      bg={stripped ? (row.index % 2 === 0 ? "white" : "gray.50") : undefined}
      _hover={{
        bg: "gray.100",
      }}
      key={row.id}
      data-state={row.getIsSelected() && "selected"}
      expanded={row.getIsExpanded()}
    >
      {row.getVisibleCells().map((cell) => {
        return (
          <TableCell
            key={cell.id}
            style={{
              ...getCommonPinningStyles(cell.column, false, row.index),
              width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
              boxShadow: cell.column.getIsResizing()
                ? "0 0 0 1px #e2e8f0"
                : undefined,
            }}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        );
      })}
    </MotionRow>
  );

  if (row.getIsExpanded()) {
    return (
      <>
        {renderedRow}
        <TableRow key={`${row.id}-sub`} expanded>
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
                >
                  {flexRender(
                    cell.column.columnDef.aggregatedCell,
                    cell.getContext()
                  )}
                </TableCell>
              );
            })}
        </TableRow>
      </>
    );
  } else {
    return renderedRow;
  }
};

const Body = ({
  table,
  tableBody,
  colSpan,
  stripped,
}: {
  table: TableType<any>;
  tableBody?: SystemStyleObject;
  colSpan: number;
  stripped?: boolean;
}) => {
  return (
    <TableBody css={tableBody}>
      <AnimatePresence>
        {table.getRowModel().rows?.length ? (
          table
            .getRowModel()
            .rows.map((row) => (
              <CustomRow
                key={row.id}
                row={row}
                table={table}
                stripped={stripped}
              />
            ))
        ) : (
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

const MemoizedTableBody = memo(Body, (prevProps, nextProps) => {
  return prevProps.table.options.data === nextProps.table.options.data;
}) as typeof Body;

export function useDataTable<T = any>() {
  const ref = useRef<DataTableRef | null>(null);

  // Criar a função de callback estável
  const handleFilterChange = useCallback((columnId: keyof T, value: any) => {
    const table = ref.current?.getTable<T>();

    table?.getColumn(columnId as string)?.setFilterValue(value);
  }, []);

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
