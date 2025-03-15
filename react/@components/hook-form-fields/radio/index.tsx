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
import { splitCssProps } from "styled-system/jsx";
import { ToggleGroup } from "@/components/toggle/styled";
import { ReactNode } from "react";
import { RadioButtonGrupoProps } from "./headless";
import { RadioButtonGroup } from "./headless/styled";

type Props = RadioButtonGrupoProps & {
  name: string;
  label?: string;
  description?: string;
  onChangeValue?: (value: string) => void;
  options: {
    value: string | number;
    render: ReactNode;
  }[];
};

export const InputRadioButton = ({
  name,
  label,
  description,
  onChangeValue,
  options,
  ...rest
}: Props) => {
  const form = useFormContext();
  const [cssProps, restProps] = splitCssProps(rest);

  return (
    <Form.FormField
      control={form.control}
      name={name}
      defaultValue=""
      render={({ field }) => (
        <Form.FormItem w="fit" {...cssProps}>
          <Form.FormLabel>{label}</Form.FormLabel>
          <Form.FormControl>
            <RadioButtonGroup.Root
              {...restProps}
              defaultValue=""
              value={field.value || []}
              onValueChange={({ value }) => {
                field.onChange(value);
                onChangeValue?.(value);
              }}
            >
              {options.map((option, id) => (
                <RadioButtonGroup.Item key={id} value={option.value}>
                  <RadioButtonGroup.ItemControl />
                  <RadioButtonGroup.ItemText>
                    {option.render}
                  </RadioButtonGroup.ItemText>
                  <RadioButtonGroup.ItemHiddenInput />
                </RadioButtonGroup.Item>
              ))}
            </RadioButtonGroup.Root>
          </Form.FormControl>
          <Form.FormDescription>{description}</Form.FormDescription>
          <Form.FormMessage />
        </Form.FormItem>
      )}
    />
  );
};
