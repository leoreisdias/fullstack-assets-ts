import { HTMLStyledProps } from "styled-system/types";
import { useTableContext } from "./hooks";
import { TableHead, TableHeader, TableResizer, TableRow } from "../../styled/table";
import { flexRender, Header as HeaderType, HeaderGroup } from "@tanstack/react-table";
import { getCommonPinningStyles } from "./helpers";

type DataTableHeaderProps = Omit<HTMLStyledProps<typeof TableHeader>, "children"> & {
  children?: (rows: HeaderGroup<any>[]) => React.ReactNode;
};

type HeaderRowProps = HTMLStyledProps<typeof TableRow> & {
  headers: HeaderType<any, unknown>[];
};

type DataTableHeadProps = HTMLStyledProps<typeof TableHead> & {
  header: HeaderType<any, unknown>;
};

function Header(props: DataTableHeaderProps) {
  const table = useTableContext();
  const headerGroups = table.getHeaderGroups();

  return (
    <TableHeader
      {...props}
      css={{
        "& .resizer": {
          opacity: 0,
        },
        ...props.css,
      }}
    >
      {!!props.children && props.children(headerGroups)}
      {!props.children &&
        headerGroups.map((headerGroup) => <HeaderRow key={headerGroup.id} headers={headerGroup.headers} />)}
    </TableHeader>
  );
}

const HeaderRow = (props: HeaderRowProps) => {
  return (
    <TableRow {...props}>
      {props.headers.map((header) => {
        return <Head key={header.id} header={header} />;
      })}
    </TableRow>
  );
};

function Head({ header, ...props }: DataTableHeadProps) {
  return (
    <TableHead
      key={header.id}
      style={{
        ...getCommonPinningStyles(header.column, true, header.index),
        width: `calc(var(--header-${header?.id}-size) * 1px)`,
      }}
      position="relative"
      borderBottom="1px solid"
      borderColor="border.muted"
      color="font"
      css={{
        "&:hover .resizer": {
          opacity: 1,
        },
      }}
      {...props}
    >
      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
      {header.column.getCanResize() && (
        <TableResizer
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
}

export { Header, HeaderRow, Head };
