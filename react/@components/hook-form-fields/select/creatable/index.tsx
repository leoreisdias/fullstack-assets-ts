import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form";
import { SelectOptionValue, SelectOptions, customSelectStyle } from "../shared";
import Select from "react-select/creatable";
import { Text } from "@/components/text";
import { getValue, getValueChanged } from "../functions/handleValues";
import { toast } from "sonner";
import { useId, useState } from "react";
import { createOption } from "@/lib/actions/select-options";
import { Skeleton } from "@/components/loadings/skeleton";
import { useClient } from "@/hooks/useClient";

type Props = {
  name: string;
  label?: string;
  description?: string;
  placeholder?: string;
  options: SelectOptions[];
  isClearable?: boolean;
  onChangeValue?: (value: SelectOptionValue) => void;
  newOptionAlias: "cost-center";
  isMulti?: boolean;
  disabled?: boolean;
  refetch: () => void;
  loading?: boolean;
};

export const InputSelectCreatable = ({
  name,
  label,
  description,
  options,
  disabled,
  isClearable,
  isMulti,
  onChangeValue,
  placeholder,
  newOptionAlias,
  refetch,
  loading,
}: Props) => {
  const form = useFormContext();
  const isClient = useClient();

  const [isLoading, setIsLoading] = useState(false);

  const handleCreatable = async (value: string) => {
    setIsLoading(true);
    try {
      const newOption = await createOption(value, newOptionAlias);

      if (isMulti) {
        const currentOptions = form.getValues(name) ?? [];
        form.setValue(name, [...currentOptions, newOption.payload.value]);
      } else form.setValue(name, newOption.payload.value);

      refetch();
    } catch (err) {
      toast.error("Ocorreu um erro ao adicionar a opção.");
    } finally {
      setIsLoading(false);
    }
  };

  const id = useId();

  if (!isClient) return <Skeleton height="43px" w="full" />;

  return (
    <Form.FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <Form.FormItem>
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
              isLoading={isLoading || loading}
              noOptionsMessage={() => "Nenhum registro encontrado =("}
              onCreateOption={handleCreatable}
              onChange={(newValue) => {
                const value = getValueChanged(newValue, !!isMulti);

                field.onChange(value ?? null);

                onChangeValue?.(
                  Array.isArray(value) ? value[0] : value ?? null
                );
              }}
              value={
                field.value !== null &&
                field.value !== undefined &&
                field.value !== ""
                  ? getValue(!!isMulti, options, field)
                  : null
              }
              formatCreateLabel={(value) => (
                <Text
                  as="span"
                  color="primary.5"
                  cursor="pointer"
                  _hover={{ color: "primary.8" }}
                >
                  Adicionar {value}
                </Text>
              )}
              loadingMessage={(props) => (
                <Text
                  as="span"
                  color="primary.5"
                  cursor="pointer"
                  _hover={{ color: "primary.8" }}
                >
                  {props.inputValue}
                </Text>
              )}
            />
          </Form.FormControl>
          <Form.FormDescription>{description}</Form.FormDescription>
          <Form.FormMessage />
        </Form.FormItem>
      )}
    />
  );
};
