"use client";

import { useFormContext } from "react-hook-form";

import { ark } from "@ark-ui/react/factory";
import type { ComponentProps } from "react";
import { splitCssProps, styled } from "styled-system/jsx";
import { textarea } from "styled-system/recipes";

const Textarea = styled(ark.textarea, textarea);
interface TextareaProps extends ComponentProps<typeof Textarea> {}

type Props = TextareaProps & {
  name: string;
  label?: string;
  description?: string;
};

const InputTextArea = ({ name, label, description, ...rest }: Props) => {
  const form = useFormContext();
  const [cssProps, restProps] = splitCssProps(rest);

  return (
    <Form.FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <Form.FormItem {...cssProps}>
          <Form.FormLabel>{label}</Form.FormLabel>
          <Form.FormControl>
            <Textarea {...field} {...restProps} fontSize="sm" />
          </Form.FormControl>
          <Form.FormDescription>{description}</Form.FormDescription>
          <Form.FormMessage />
        </Form.FormItem>
      )}
    />
  );
};

export { InputTextArea };
