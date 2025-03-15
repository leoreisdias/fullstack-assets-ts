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
import { NumberInput, NumberInputProps } from "../pure-input-number";

type Props = NumberInputProps & {
  name: string;
  label?: string;
  description?: string;
};

export const InputNumber = ({ name, label, description, ...rest }: Props) => {
  const form = useFormContext();

  return (
    <Form.FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <Form.FormItem>
          <Form.FormLabel>{label}</Form.FormLabel>
          <Form.FormControl>
            <NumberInput {...rest} {...field} />
          </Form.FormControl>
          <Form.FormDescription>{description}</Form.FormDescription>
          <Form.FormMessage />
        </Form.FormItem>
      )}
    />
  );
};
