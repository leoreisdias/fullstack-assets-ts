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
import { PatternFormat } from "react-number-format";
import { styled } from "styled-system/jsx";
import { input } from "styled-system/recipes";
import { SystemStyleObject } from "styled-system/types";

const InputStyled = styled(PatternFormat, input);

type Props = {
  name: string;
  label?: string;
  description?: string;
  format: string;
  css?: SystemStyleObject;
  placeholder?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
};

export const InputMask = ({
  name,
  label,
  description,
  format,
  css,
  placeholder,
  onValueChange,
  disabled,
}: Props) => {
  const form = useFormContext();

  return (
    <Form.FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <Form.FormItem>
          <Form.FormLabel>{label}</Form.FormLabel>
          <Form.FormControl>
            <InputStyled
              disabled={disabled}
              css={css}
              minH="44px"
              format={format}
              placeholder={placeholder}
              onValueChange={({ value }) => {
                field.onChange(value);
                onValueChange?.(value);
              }}
              value={!!field.value ? field.value : ""}
            />
          </Form.FormControl>
          <Form.FormDescription>{description}</Form.FormDescription>
          <Form.FormMessage />
        </Form.FormItem>
      )}
    />
  );
};
