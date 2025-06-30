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
import { css } from "styled-system/css";
import { Flex } from "styled-system/jsx";
import { icon } from "styled-system/recipes";
import { SystemStyleObject } from "styled-system/types";
import { useTableContext } from "./hooks";
import { memo } from "react";

type DataTablePaginationProps = {
  css?: SystemStyleObject;
};

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

function BasePagination({ css: cssProps }: DataTablePaginationProps) {
  const { table } = useTableContext();

  return (
    <Flex align="center" justify="space-between" px="2" w="full" css={cssProps}>
      <Flex align="center" gap="2">
        <Select.Root
          positioning={{ sameWidth: true }}
          width="2xs"
          defaultValue={[table.getState().pagination.pageSize.toString()]}
          maxW="100px"
          collection={collection}
          onValueChange={(detail) => {
            table.setPageSize(+detail.value);
          }}
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

const Pagination = memo(BasePagination);

export { Pagination };
