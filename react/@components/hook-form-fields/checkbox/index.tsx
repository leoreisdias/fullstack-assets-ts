"use client";

import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/form";
import { Checkbox, CheckboxProps } from "@/components/form/pure-checkbox";
import { ReactNode } from "react";
import { SystemStyleObject } from "styled-system/types";

type Props = CheckboxProps & {
  name: string;
  label?: string;
  description?: string;
  children?: ReactNode;
  css?: SystemStyleObject;
};

export const InputCheck = ({
  name,
  label,
  description,
  children,
  css: formItemCss,
  ...rest
}: Props) => {
  const form = useFormContext();

  return (
    <Form.FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <Form.FormItem css={formItemCss}>
          <Form.FormControl fontSize="sm" fontWeight="normal">
            <Checkbox
              checked={field.value}
              {...field}
              w="full"
              {...rest}
              size="sm"
            >
              {label}
              {children}
            </Checkbox>
          </Form.FormControl>
          <Form.FormDescription>{description}</Form.FormDescription>
          <Form.FormMessage />
        </Form.FormItem>
      )}
    />
  );
};
