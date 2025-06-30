"use client";
import * as React from "react";
import { styled } from "styled-system/jsx";
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
} from "styled-system/recipes";

const TableContainer = styled("div", tableContainer);

const SCROLL_SPEED = 1.5; // or pass via props
const DRAG_THRESHOLD = 10; // em pixels

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement> & {
    tableProps?: React.HTMLAttributes<HTMLDivElement>;
  }
>((props, forwardedRef) => {
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
      <table ref={forwardedRef} {...props.tableProps}>
        {props.children}
      </table>
    </TableContainer>
  );
});
Table.displayName = "Table";

export const Root = styled(Table, tableRoot);
export const Header = styled("thead", tableHeader);
export const Body = styled("tbody", tableBody);
export const Footer = styled("tfoot", tableFooter);
export const Head = styled("th", tableHead);
export const Row = styled("tr", tableRow);
export const Cell = styled("td", tableCell);
export const Caption = styled("caption", tableCaption);

export const Resizer = styled("div", {
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
