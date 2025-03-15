"use client";

import { useFormContext } from "react-hook-form";

import { Input } from "@/components/form/pure-input";
import { splitCssProps } from "styled-system/jsx";
import { ToogleProps } from "@/components/toggle";
import { ToggleGroup } from "@/components/toggle/styled";
import { ArrowDown, ArrowUp } from "@phosphor-icons/react/dist/ssr";
import { ReactNode } from "react";
import { Form } from "../styled";

type Props = ToogleProps & {
  name: string;
  label?: string;
  description?: string;
  onValueChange?: (value: string) => void;
  options: {
    value: string;
    render: ReactNode;
  }[];
};

export const InputToggle = ({
  name,
  label,
  description,
  onValueChange,
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
      render={({ field }) => {
        return (
          <Form.FormItem w="fit" {...cssProps}>
            <Form.FormLabel>{label}</Form.FormLabel>
            <Form.FormControl>
              <ToggleGroup.Root
                {...restProps}
                multiple
                value={field.value || []}
                onValueChange={(details) => {
                  field.onChange(details.value);
                }}
              >
                {options.map((option) => (
                  <ToggleGroup.Item
                    p={1}
                    key={option.value}
                    value={option.value}
                    aria-label={`Toggle ${option.value}`}
                  >
                    {option.render}
                  </ToggleGroup.Item>
                ))}
              </ToggleGroup.Root>
            </Form.FormControl>
            <Form.FormDescription>{description}</Form.FormDescription>
            <Form.FormMessage />
          </Form.FormItem>
        );
      }}
    />
  );
};
