import { Column } from "@tanstack/react-table";
import { CSSProperties } from "react";
import { token } from "styled-system/tokens";

export const getCommonPinningStyles = (
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
