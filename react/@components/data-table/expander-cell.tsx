/**
 * A default example component for a table cell that acts as an expander
 * to toggle the visibility of sub-rows in a data table. This cell is
 * intended to be used in the header definitions of columns in the
 * TanStack Table (the base table library).
 *
 * This component provides a button with an icon that changes dynamically
 * based on the expansion state of the row. The icons used are customizable
 * and can be adapted to the developer's preferences or requirements.
 *
 * @param row - The row object from the `@tanstack/react-table` library,
 *              which contains methods and properties for managing the
 *              row's state, including expansion.
 * @param startExpanded - An optional boolean that, if true, ensures the
 *                        row starts in an expanded state when the component
 *                        is mounted.
 *
 * @remarks
 * - The component uses the `toggleExpanded` method from the row object
 *   to control the expansion state.
 * - The `useEffect` hook is used to automatically expand the row if the
 *   `startExpanded` prop is provided and set to true.
 * - The button's icon dynamically switches between `CaretUp` and `CaretDown`
 *   from the `@phosphor-icons/react` library, but developers can replace
 *   these icons with their own choices or make further adaptations.
 *
 * @example
 * ```tsx
 * <ExpanderCell row={row} startExpanded={true} />
 * ```
 *
 * @see {@link https://tanstack.com/table/v8/docs/guide/introduction | TanStack Table Documentation}
 */

import { Button } from "@/components/ui/button";
import { CaretDown, CaretUp } from "@phosphor-icons/react/dist/ssr";
import { Row } from "@tanstack/react-table";
import { useEffect } from "react";
import { Flex } from "styled-system/jsx";

export const ExpanderCell = ({
  row,
  startExpanded,
}: {
  row: Row<any>;
  startExpanded?: boolean;
}) => {
  const { toggleExpanded } = row;

  useEffect(() => {
    if (startExpanded) {
      toggleExpanded();
    }
  }, [toggleExpanded, startExpanded]);

  return (
    <Flex align="center" gap={2}>
      <Button
        onClick={() => row.toggleExpanded()}
        size="icon"
        variant="outline"
        _hover={{ color: "secondary.6" }}
      >
        {row.getIsExpanded() ? <CaretUp size={20} /> : <CaretDown size={20} />}
      </Button>
    </Flex>
  );
};

export const EXPANDER_CELL_ACCESSOR = "expander";
