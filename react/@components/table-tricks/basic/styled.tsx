"use client";
import { ForwardRefComponent, HTMLMotionProps, motion } from "motion/react";
import * as React from "react";
import { HTMLStyledProps, styled, StyledComponent } from "styled-system/jsx";
import {
  tableContainer,
  tableRoot,
  tableHeader,
  tableBody,
  tableFooter,
  tableHead,
  tableRow,
  tableCell,
  tableCaption,
  TableHeaderVariantProps,
  TableBodyVariantProps,
  TableFooterVariantProps,
  TableHeadVariantProps,
  TableRowVariantProps,
  TableCellVariantProps,
  TableCaptionVariantProps,
  TableVariantProps,
} from "styled-system/recipes";
const TableContainer = styled("div", tableContainer);

const HTMLTable = styled("table") as StyledComponent<
  "table",
  TableVariantProps & { as?: React.ElementType }
>;

const SCROLL_SPEED = 1.5; // or pass via props
const DRAG_THRESHOLD = 10; // em pixels

const BaseTable = React.forwardRef<
  HTMLTableElement,
  HTMLStyledProps<typeof HTMLTable>
>(({ as, style, ...props }, forwardedRef) => {
  const tableRef = React.useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [scrollLeft, setScrollLeft] = React.useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!tableRef.current) return;
    // Verifica se o mouse está sobre o tbody para ativar o drag scroll
    const target = e.target as HTMLElement;
    let isInTbody = false;
    let el: HTMLElement | null = target;
    while (el && el !== tableRef.current) {
      if (el.tagName.toLowerCase() === "tbody") {
        isInTbody = true;
        break;
      }
      el = el.parentElement;
    }
    if (!isInTbody) return;

    setStartX(e.pageX - tableRef.current.offsetLeft);
    setScrollLeft(tableRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons !== 1 || !tableRef.current) return;
    // Verifica se o mouse está sobre o tbody para permitir o drag scroll
    const target = e.target as HTMLElement;
    let isInTbody = false;
    let el: HTMLElement | null = target;
    while (el && el !== tableRef.current) {
      if (el.tagName.toLowerCase() === "tbody") {
        isInTbody = true;
        break;
      }
      el = el.parentElement;
    }
    if (!isInTbody) return;

    const x = e.pageX - tableRef.current.offsetLeft;
    if (!isDragging && Math.abs(x - startX) > DRAG_THRESHOLD) {
      setIsDragging(true);
    }
    // Se não estiver em drag, não faz nada (permitindo seleção de texto)
    if (!isDragging) return;

    const walk = (x - startX) * SCROLL_SPEED; // Adjust scroll speed
    requestAnimationFrame(() => {
      if (tableRef.current) {
        tableRef.current.scrollLeft = scrollLeft - walk;
      }
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  console.log("Table rendered with props:", props);

  return (
    <TableContainer
      role="table"
      aria-label="Scrollable table"
      tabIndex={0}
      ref={tableRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
      onMouseUp={handleMouseUp}
      overflowX="auto"
      width="100%" // Allows the container to occupy all available width
      maxWidth="100%" // Never exceeds the maximum size of the parent container
      borderRadius="md"
      border="1px solid"
      borderColor="border.muted"
      userSelect={isDragging ? "none" : "text"}
      cursor={isDragging ? "grabbing" : undefined}
      {...props}
    >
      <HTMLTable ref={forwardedRef} as={as} w="full" style={style}>
        {props.children}
      </HTMLTable>
    </TableContainer>
  );
});
BaseTable.displayName = "Table";

export const Table = styled(BaseTable, tableRoot) as StyledComponent<
  ForwardRefComponent<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>,
  TableVariantProps & { as?: React.ElementType }
>;
export const TableHeader = styled("thead", tableHeader) as StyledComponent<
  "thead",
  TableHeaderVariantProps & { as?: React.ElementType }
>;
export const TableBody = styled("tbody", tableBody) as StyledComponent<
  "tbody",
  TableBodyVariantProps & { as?: React.ElementType }
>;
export const TableFooter = styled("tfoot", tableFooter) as StyledComponent<
  "tfoot",
  TableFooterVariantProps & { as?: React.ElementType }
>;
export const TableHead = styled("th", tableHead) as StyledComponent<
  "th",
  TableHeadVariantProps & { as?: React.ElementType }
>;

export const TableRow = motion.create(
  styled("tr", tableRow) as StyledComponent<
    "tr",
    TableRowVariantProps & { as?: React.ElementType }
  >
);

export const TableCell = styled("td", tableCell) as StyledComponent<
  "td",
  TableCellVariantProps & { as?: React.ElementType }
>;
export const TableCaption = styled("caption", tableCaption) as StyledComponent<
  "caption",
  TableCaptionVariantProps & { as?: React.ElementType }
>;

export const TableResizer = styled("div", {
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
