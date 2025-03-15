"use client";

import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form";
import { SelectOptionValue, SelectOptions, customSelectStyle } from "./shared";
import Select, { components, GroupBase, NoticeProps } from "react-select";
import { Text } from "@/components/text";
import { getValue, getValueChanged } from "./functions/handleValues";
import { useEffect, useId, useState } from "react";
import { Skeleton } from "@/components/loadings/skeleton";
import { HTMLStyledProps } from "styled-system/types";

type Props = {
  name: string;
  label?: string;
  description?: string;
  placeholder?: string;
  options: SelectOptions[];
  isClearable?: boolean;
  onChangeValue?: (value: SelectOptionValue) => void;
  isMulti?: boolean;
  disabled?: boolean;
} & HTMLStyledProps<typeof FormItem>;

const NoOptionsMessage = (
  props: NoticeProps<SelectOptions, boolean, GroupBase<SelectOptions>>
) => {
  return (
    <components.NoOptionsMessage {...props}>
      <Text as="span" color="gray.600">
        Ooops! Nenhum registro encontrado =(
      </Text>
    </components.NoOptionsMessage>
  );
};

export const InputSelect = ({
  name,
  label,
  description,
  options,
  disabled,
  isClearable,
  isMulti,
  onChangeValue,
  placeholder,
  ...rest
}: Props) => {
  const form = useFormContext();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const id = useId();

  if (!isClient) return <Skeleton height="43px" w="full" />;

  return (
    <Form.FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <Form.FormItem {...rest}>
          <Form.FormLabel>{label}</Form.FormLabel>
          <Form.FormControl>
            <Select
              {...field}
              instanceId={id}
              isSearchable
              options={options}
              isOptionDisabled={(option) => !!option.disabled}
              isClearable={isClearable}
              placeholder={placeholder ?? "Selecione uma opção"}
              styles={customSelectStyle}
              isDisabled={disabled}
              isMulti={isMulti}
              noOptionsMessage={() => "Nenhum registro encontrado =("}
              onChange={(newValue) => {
                const value = getValueChanged(newValue, !!isMulti);

                field.onChange(value ?? null);

                onChangeValue?.(
                  Array.isArray(value) ? value[0] : value ?? null
                );
              }}
              value={
                field.value !== null && field.value !== undefined
                  ? getValue(!!isMulti, options, field)
                  : null
              }
              components={{
                NoOptionsMessage: NoOptionsMessage,
              }}
            />
          </Form.FormControl>
          <Form.FormDescription>{description}</Form.FormDescription>
          <Form.FormMessage />
        </Form.FormItem>
      )}
    />
  );
};
