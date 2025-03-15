"use client";

import { useFormContext } from "react-hook-form";

import { Input, InputProps } from "@/components/form/pure-input";
import { splitCssProps } from "styled-system/jsx";

type Props = InputProps & {
  name: string;
  label?: string;
  description?: string;
  onValueChange?: (value: string) => void;
};

export const InputText = ({
  name,
  label,
  description,
  onValueChange,
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
        <Form.FormItem {...cssProps}>
          <Form.FormLabel>{label}</Form.FormLabel>
          <Form.FormControl>
            <Input
              {...restProps}
              {...field}
              onChange={(e) => {
                field.onChange(e);
                onValueChange?.(e.target.value);
              }}
              value={field.value ?? ""}
            />
          </Form.FormControl>
          <Form.FormDescription>{description}</Form.FormDescription>
          <Form.FormMessage />
        </Form.FormItem>
      )}
    />
  );
};
