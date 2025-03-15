import { CurrencyInput, ICurrencyMaskProps } from "react-currency-mask";
import { useFormContext } from "react-hook-form";
import { splitCssProps } from "styled-system/jsx";

import { Input, InputProps } from "@/components/form/pure-input";
import Form from "@/components/form";

type Props = Partial<ICurrencyMaskProps> &
  InputProps & {
    name: string;

    disabled?: boolean;
    placeholder?: string;
    label?: string;
    description?: string;
  };

export const InputCurrency = ({
  name,

  disabled,
  placeholder,
  label,
  description,
  ...rest
}: Props) => {
  const form = useFormContext();

  const [cssProps, controlProps] = splitCssProps(rest);

  return (
    <Form.FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <Form.FormItem {...cssProps}>
          <Form.FormLabel>{label}</Form.FormLabel>
          <Form.FormControl>
            <CurrencyInput
              {...controlProps}
              value={field.value}
              onChangeValue={(_, value, maskedValue) => {
                field.onChange(value);
                controlProps.onChangeValue?.(_, value, maskedValue);
              }}
              InputElement={
                <Input
                  placeholder={placeholder}
                  disabled={disabled}
                  pl={4}
                  fontWeight="normal"
                />
              }
            />
          </Form.FormControl>
          <Form.FormDescription>{description}</Form.FormDescription>
          <Form.FormMessage />
        </Form.FormItem>
      )}
    />
  );
};
