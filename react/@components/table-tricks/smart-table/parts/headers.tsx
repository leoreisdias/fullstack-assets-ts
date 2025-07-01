import { HTMLStyledProps } from "styled-system/types";
import { useTableContext } from "./hooks";
import {
  TableHead,
  TableHeader,
  TableResizer,
  TableRow,
} from "../../styled/table";
import {
  flexRender,
  Header as HeaderType,
  HeaderGroup,
} from "@tanstack/react-table";
import { getCommonPinningStyles } from "./helpers";
import React from "react";

type DataTableHeaderProps = Omit<
  HTMLStyledProps<typeof TableHeader>,
  "children"
> & {
  children?: ((rows: HeaderGroup<any>[]) => React.ReactNode) | React.ReactNode;
};

type HeaderRowProps = Omit<HTMLStyledProps<typeof TableRow>, "children"> & {
  headers: HeaderType<any, unknown>[];
  children?: (headers: HeaderType<any, unknown>) => React.ReactNode;
};

type DataTableHeadProps = HTMLStyledProps<typeof TableHead> & {
  head: HeaderType<any, unknown>;
};

function Header({ children, ...props }: DataTableHeaderProps) {
  const { table, asFlex } = useTableContext();
  const headerGroups = table.getHeaderGroups();

  const hasCustomRender = children !== undefined && children !== null;
  const isChildrenFunction = typeof children === "function";

  return (
    <TableHeader
      {...props}
      css={{
        "& .resizer": {
          opacity: 0,
        },
        ...props.css,
      }}
      as={asFlex ? "div" : "thead"}
    >
      {hasCustomRender && !isChildrenFunction && <>{children}</>}
      {hasCustomRender && isChildrenFunction && <>{children(headerGroups)}</>}
      {!hasCustomRender &&
        headerGroups.map((headerGroup) => {
          return (
            <HeaderRow key={headerGroup.id} headers={headerGroup.headers} />
          );
        })}
    </TableHeader>
  );
}

const HeaderRows = (props: Omit<HeaderRowProps, "headers">) => {
  const { table } = useTableContext();
  const headerGroups = table.getHeaderGroups();

  return headerGroups.map((headerGroup) => (
    <HeaderRow key={headerGroup.id} headers={headerGroup.headers} {...props} />
  ));
};

const HeaderRow = ({ children, ...props }: HeaderRowProps) => {
  const { asFlex } = useTableContext();

  return (
    <TableRow
      {...props}
      as={asFlex ? "div" : "tr"}
      asFlex={asFlex ? true : false}
    >
      {props.headers.map((header) => {
        if (!!children) {
          return children(header);
        }

        return <Head key={header.id} head={header} />;
      })}
    </TableRow>
  );
};

function Head({ head, ...props }: DataTableHeadProps) {
  const { asFlex } = useTableContext();

  return (
    <TableHead
      key={head.id}
      style={{
        ...getCommonPinningStyles(head.column, true, head.index),
        width: `calc(var(--header-${head?.id}-size) * 1px)`,
      }}
      data-state={head.column.getCanResize() ? "resizable" : undefined}
      position="relative"
      color="font"
      css={{
        "&:hover .resizer": {
          opacity: 1,
        },
      }}
      as={asFlex ? "div" : "th"}
      asFlex={asFlex ? true : false}
      {...props}
    >
      {head.isPlaceholder
        ? null
        : flexRender(head.column.columnDef.header, head.getContext())}
      {head.column.getCanResize() && (
        <TableResizer
          className="resizer"
          {...{
            onDoubleClick: () => head.column.resetSize(),
            onMouseDown: head.getResizeHandler(),
            onTouchStart: head.getResizeHandler(),
          }}
          isResizing={head.column.getIsResizing()}
        />
      )}
    </TableHead>
  );
}

export { Header, HeaderRow, HeaderRows, Head };
