"use client";

// NOTE: pra primeiro armazenar e depois envia pra URL, pegar da URL por ultimo! Facilita integracoes diretas com SSR, e nao prejudica o CSR

import { Filter, ListFilter, Loader2, MoreVertical, Save } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { startTransition, useCallback, useEffect, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import toast from "react-hot-toast";
import { useQueryClient } from "react-query";

import { Button } from "@/app/components/Button";
import { DropdownMenu } from "@/app/components/DropdownMenu";
import { DynamicField } from "@/app/components/Filters/DynamicField";
import {
  convertObjectToQueryString,
  convertQueryStringToObject,
} from "@/app/components/Filters/helper";
import { Form } from "@/app/components/Form";
import { InputText } from "@/app/components/Form/Inputs";
import { SelectOptions } from "@/app/components/Form/Inputs/InputSelect";
import { Modal, useModal } from "@/app/components/Modal";
import { AlertModal, useAlertModal } from "@/app/components/Modal/Alert";
import { Separator } from "@/app/components/Separator";
import { Skeleton } from "@/app/components/Skeleton";
import { Typography } from "@/app/components/Typography";
import { useFetch } from "@/app/hooks/useFetch";
import { createFilter, deleteFilter } from "@/app/lib/actions/filters.actions";
import { ModulesEnum } from "@/app/types/enums/modules";
import { Result } from "@/app/types/responses";
import { MyFiltersUseCase } from "@/app/types/use-cases/my-filters";
import { useTranslation } from "@/app/utils/i18n/client";
import { zod } from "@/app/validations";
import { css, cx } from "@/styled-system/css";
import { Box, Flex, Grid } from "@/styled-system/jsx";
import { icon } from "@/styled-system/recipes";
import { zodResolver } from "@hookform/resolvers/zod";

export type AdvancedFiltersOptions = {
  label: string;
  name: string;
  type: "text" | "select" | "date" | "number";
  mask?: string;
  options?: SelectOptions[];
  onlyModal?: boolean;
  isMulti?: boolean;
};

type Props = {
  filters: AdvancedFiltersOptions[];
  onApplyFilters: (filters: Record<string, string | string[]> | null) => void;
  module: ModulesEnum;
};

const filterSchema = zod.object({
  filterName: zod.string(),
});

const FilterSave = ({
  close,
  module,
}: {
  close: () => void;
  module: ModulesEnum;
}) => {
  const form = useForm<{ filterName: string }>({
    resolver: zodResolver(filterSchema),
  });
  const { t } = useTranslation(["filters"]);

  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const onSubmit = async (data: { filterName: string }) => {
    const filters = convertQueryStringToObject(searchParams.toString());

    const response = await createFilter({
      filters: filters,
      module,
      filterName: data.filterName,
    });

    if (response.isSuccess) {
      toast.success(t("filters:filterSaved"));
      queryClient.invalidateQueries(`/filters/my-filters/${module}`);
      close();
    } else toast.error(response.message);
  };

  return (
    <Flex flexDir="column" gap={4} w="full">
      <Typography.Text>{t("filters:saveCurrentFilters")}</Typography.Text>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <InputText label={t("filters:filterName")} name="filterName" />
          <Flex w="full" justify="flex-end" align="center" gap={4} mt={4}>
            <Button
              variant="outline"
              onClick={close}
              type="button"
              isLoading={form.formState.isSubmitting}
            >
              {t("filters:cancel")}
            </Button>
            <Button type="submit" isLoading={form.formState.isSubmitting}>
              {t("filters:toSave")}
            </Button>
          </Flex>
        </form>
      </Form>
    </Flex>
  );
};

const MyFilters = ({
  module,
  close,
  onApplyFilters,
}: {
  module: ModulesEnum;
  close: () => void;
  onApplyFilters: (filters: Record<string, string | string[]> | null) => void;
}) => {
  const { t } = useTranslation(["filters"]);
  const [isDeleting, setIsDeleting] = useState(false);
  const { ref, open, close: closeAlert } = useAlertModal();

  const form = useFormContext();
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const { data, isLoading } = useFetch<Result<MyFiltersUseCase[]>>(
    `/filters/my-filters/${module}`
  );

  const onQuickFilterApply = (filters: Record<string, string | string[]>) => {
    startTransition(() => {
      form.reset(filters);
      const query = convertObjectToQueryString(filters);

      onApplyFilters(filters);
      close();
      router.push(`${pathname}?${query}`);
    });
  };

  const onDelete = async (id: number) => {
    closeAlert?.();
    setIsDeleting(true);
    const response = await deleteFilter(id, module);
    setIsDeleting(false);
    if (response.isSuccess) {
      toast.success(t("filters:filterDeleted"));
      queryClient.invalidateQueries(`/filters/my-filters/${module}`);
    } else toast.error(response.message);
  };

  return (
    <Flex w="full" flexWrap="wrap" gap={4}>
      {isLoading && <Skeleton w="full" height="50px" />}
      {!isLoading &&
        data?.payload.map((filter) => (
          <Box key={filter.id}>
            <DropdownMenu
              isLoading={isDeleting}
              items={[
                {
                  title: t("filters:apply"),
                  action: () => onQuickFilterApply(filter.filters),
                },
                {
                  title: t("filters:delete"),
                  action: open,
                },
              ]}
            >
              <Flex
                gap={4}
                align="center"
                border="1px solid #F2F2F2"
                borderRadius="md"
                padding={2}
                paddingInline={4}
                color="blue.700"
                cursor="pointer"
              >
                {isDeleting && (
                  <Loader2
                    size={18}
                    className={cx(icon(), css({ animation: "spin" }))}
                  />
                )}
                {filter.name}
                <MoreVertical size={18} />
              </Flex>
            </DropdownMenu>
            <AlertModal
              ref={ref}
              onConfirm={() => onDelete(filter.id)}
              title={t("filters:deleteConfirmation")}
              description={t("filters:deleteDescription")}
            />
          </Box>
        ))}
    </Flex>
  );
};

export const AdvancedFilters = ({ filters, onApplyFilters, module }: Props) => {
  const { t } = useTranslation(["filters"]);
  const { ref, open, close } = useModal();
  const { ref: saveRef, open: openSave, close: closeSave } = useModal();
  const router = useRouter();
  const pathname = usePathname();

  const outOfModalFilters = filters.filter((filter) => !filter.onlyModal);

  const form = useForm();

  const searchParams = useSearchParams();
  const hasFilters = searchParams && searchParams.size > 0;

  const onApply = () => {
    if (!searchParams || searchParams.size === 0) {
      return onApplyFilters(null);
    }

    const filters = convertQueryStringToObject(searchParams.toString());

    onApplyFilters(filters);
  };

  const onReset = () => {
    form.reset();
    router.push(pathname);

    onApplyFilters(null);
  };

  const { reset } = form;

  const applyFiltersOnUrl = useCallback(() => {
    if (!!window.location.search) {
      const filters = convertQueryStringToObject(window.location.search);
      reset(filters);
    }
  }, [reset]);

  const resetEmptyFilters = useCallback(() => {
    if (searchParams.size === 0) {
      onApplyFilters(null);
    }
  }, [onApplyFilters, searchParams.size]);

  useEffect(() => {
    applyFiltersOnUrl();
  }, [applyFiltersOnUrl]);

  useEffect(() => {
    resetEmptyFilters();
  }, [resetEmptyFilters]);

  return (
    <Flex align="center" gap={4} justify="flex-start" mb={2} wrap="wrap">
      <Form {...form}>
        {outOfModalFilters.map((filter) => (
          <DynamicField key={filter.name} field={filter} />
        ))}
        <Flex gap={4} justify="flex-end" align="center" ml="auto">
          <Button
            variant="outline"
            onClick={open}
            transform="translateY(20%)"
            type="button"
          >
            <ListFilter size={18} />
            {t("filters:filters")}
          </Button>
          {hasFilters && (
            <>
              <Button
                variant="outline"
                onClick={onApply}
                transform="translateY(20%)"
              >
                <Filter size={18} />
                {t("filters:apply")}
              </Button>
              <Button
                variant="ghost"
                onClick={onReset}
                transform="translateY(20%)"
              >
                {t("filters:toReset")}
              </Button>
              <Button
                variant="secondary"
                onClick={openSave}
                transform="translateY(20%)"
              >
                <Save size={16} />
                {t("filters:saveFilters")}
              </Button>
            </>
          )}
        </Flex>

        <Modal
          ref={ref}
          title={t("filters:selectFilters")}
          footer={
            <Flex gap={4} w="full" justify="flex-end" align="center">
              <Button variant="ghost" onClick={onReset}>
                {t("filters:toReset")}
              </Button>
              <Button variant="outline" onClick={close}>
                {t("filters:close")}
              </Button>
              <Button variant="outline" onClick={onApply}>
                <Filter size={18} />
                {t("filters:apply")}
              </Button>
            </Flex>
          }
        >
          <Flex flexDir="column" gap={4} minW="780px">
            <Typography.Text>{t("filters:savedFilters")}</Typography.Text>
            <MyFilters
              module={module}
              close={close}
              onApplyFilters={onApplyFilters}
            />

            <Separator my={4} />

            <Typography.Text>{t("filters:toFilter")}</Typography.Text>

            <Grid w="full" gridTemplateColumns="1fr 1fr 1fr" gap={4} rowGap={6}>
              {filters.map((filter) => (
                <DynamicField key={filter.name} field={filter} />
              ))}
            </Grid>
          </Flex>
        </Modal>
      </Form>
      <Modal ref={saveRef} title={t("filters:saveFilters")}>
        <FilterSave close={closeSave} module={module} />
      </Modal>
    </Flex>
  );
};

export const useFilters = () => {
  const [filters, setFilters] = useState<Record<string, string | string[]>>({});

  const onApplyFilters = useCallback(
    (filters: Record<string, string | string[]> | null) => {
      if (!filters) {
        setFilters({});
      } else setFilters(filters);
    },
    []
  );

  return {
    filters,
    onApplyFilters,
  };
};
