/**
 * This file provides a set of headless, composable table components styled using PandaCSS,
 * inspired by Radix UI's design principles. The components are designed to be flexible and
 * customizable, allowing developers to build accessible and responsive tables with ease.
 *
 * The main `Table` component serves as a scrollable container with drag-to-scroll functionality
 * implemented for the `<tbody>` section. This feature enhances the user experience when dealing
 * with large datasets by enabling horizontal scrolling via mouse dragging.
 *
 * The file also exports additional styled components such as `TableHeader`, `TableBody`,
 * `TableFooter`, `TableHead`, `TableRow`, `TableCell`, and `TableCaption`, which can be
 * composed together to create fully functional and accessible table structures.
 *
 * Styling is handled using PandaCSS's `styled` utility and recipes, ensuring a consistent
 * design system and easy customization.
 *
 * Source of inspiration: https://shadow-panda.dev/docs/components/table
 */

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
const DRAG_THRESHOLD = 2; // em pixels

const BaseTable = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
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
      cursor={isDragging ? "grabbing" : "default"}
      {...props}
    />
  );
});
BaseTable.displayName = "Table";

export const Table = styled(BaseTable, tableRoot);
export const TableHeader = styled("thead", tableHeader);
export const TableBody = styled("tbody", tableBody);
export const TableFooter = styled("tfoot", tableFooter);
export const TableHead = styled("th", tableHead);
export const TableRow = styled("tr", tableRow);
export const TableCell = styled("td", tableCell);
export const TableCaption = styled("caption", tableCaption);
