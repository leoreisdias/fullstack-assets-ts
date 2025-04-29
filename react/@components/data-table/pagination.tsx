/**
 * DataTablePagination Component
 *
 * This file implements a pagination component for tables based on the `@tanstack/react-table` library.
 * It uses PandaCSS for styling and the headless and composable components from ArkUI to create an
 * accessible and highly customizable interface.
 *
 * ## Purpose
 * The main goal of this component is to provide a reusable solution for table pagination, allowing
 * users to navigate between pages of data and adjust the number of items displayed per page. It is
 * designed to be flexible and extensible, seamlessly integrating with the state and functionalities
 * of `@tanstack/react-table`.
 *
 * ## Features
 * - **Page Size Selection:** Allows users to select how many items should be displayed per page
 *   using the `Select` component from ArkUI.
 * - **Page Navigation:** Includes buttons to navigate to the first, previous, next, and last pages.
 * - **Accessibility:** Follows best practices for accessibility, such as screen-reader-only texts
 *   (`srOnly`), ensuring the component is usable by all users.
 * - **Responsive Styling:** Adapts to different screen sizes, hiding or showing elements as needed
 *   (e.g., navigation buttons for the first and last pages).
 *
 * ## Insights
 * - **Integration with PandaCSS:** The use of PandaCSS enables declarative and consistent styling,
 *   making the component easier to maintain and customize.
 * - **Headless Components from ArkUI:** The composable and headless approach of ArkUI provides
 *   flexibility to customize the appearance and behavior of the component without sacrificing
 *   accessibility.
 * - **State Synchronized with the Table:** The component directly synchronizes with the table's state
 *   (`table.getState()`), ensuring that pagination changes are correctly reflected in the interface.
 *
 * ## Usage
 * This component is ideal for applications that use tables with large volumes of data and require a
 * robust and accessible pagination solution. It can be easily integrated into any project that uses
 * `@tanstack/react-table` and PandaCSS.
 *
 * @template TData The type of data displayed in the table.
 * @param {DataTablePaginationProps<TData>} props The component's properties, including the table instance
 * and optionally the total number of items.
 * @returns {JSX.Element} The rendered pagination component.
 */

import { Button } from "@/components/ui/button";
import { Select, createListCollection } from "@/components/ui/park/select";
import {
  CaretDoubleLeft,
  CaretDoubleRight,
  CaretDown,
  CaretLeft,
  CaretRight,
  Check,
} from "@phosphor-icons/react/dist/ssr";
import { Table } from "@tanstack/react-table";
import { css } from "styled-system/css";
import { Flex } from "styled-system/jsx";
import { icon } from "styled-system/recipes";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  count?: number;
}

const collection = createListCollection({
  items: [
    { label: "10", value: "10" },
    { label: "20", value: "20" },
    { label: "30", value: "30" },
    { label: "40", value: "40" },
    { label: "50", value: "50" },
    { label: "100", value: "100" },
  ],
});

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  return (
    <Flex align="center" justify="space-between" px="2" w="full">
      <Flex align="center" gap="2">
        <Select.Root
          positioning={{ sameWidth: true }}
          width="2xs"
          defaultValue={[table.getState().pagination.pageSize.toString()]}
          maxW="100px"
          collection={collection}
        >
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText placeholder="" />
              <CaretDown />
            </Select.Trigger>
          </Select.Control>
          <Select.Positioner>
            <Select.Content>
              <Select.ItemGroup>
                <Select.ItemGroupLabel></Select.ItemGroupLabel>
                {collection.items.map((item) => (
                  <Select.Item key={item.value.toString()} item={item}>
                    <Select.ItemText>{item.label}</Select.ItemText>
                    <Select.ItemIndicator>
                      <Check />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.ItemGroup>
            </Select.Content>
          </Select.Positioner>
        </Select.Root>
      </Flex>

      <Flex align="center" gap="2" justify="center">
        <Flex
          w="100px"
          align="center"
          justify="center"
          textStyle="sm"
          fontWeight="medium"
        >
          Pag. {table.getState().pagination.pageIndex + 1} de{" "}
          {table.getPageCount()}
        </Flex>
        <Button
          variant="ghost"
          display="none"
          h="8"
          w="8"
          p="0"
          lg={{ display: "flex" }}
          onClick={() => {
            table.setPageIndex(0);
          }}
          disabled={!table.getCanPreviousPage()}
        >
          <span className={css({ srOnly: true })}>Ir para primeira página</span>
          <CaretDoubleLeft className={icon()} />
        </Button>
        <Button
          variant="ghost"
          h="8"
          w="8"
          p="0"
          onClick={() => {
            table.previousPage();
          }}
          disabled={!table.getCanPreviousPage()}
        >
          <span className={css({ srOnly: true })}>Go to previous page</span>
          <CaretLeft className={icon()} />
        </Button>
        <Button
          variant="ghost"
          h="8"
          w="8"
          p="0"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <span className={css({ srOnly: true })}>Go to next page</span>
          <CaretRight className={icon()} />
        </Button>
        <Button
          variant="ghost"
          display="none"
          h="8"
          w="8"
          p="0"
          lg={{ display: "flex" }}
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <span className={css({ srOnly: true })}>Go to last page</span>
          <CaretDoubleRight className={icon()} />
        </Button>
      </Flex>
    </Flex>
  );
}
