import Select, { components, GroupBase, NoticeProps, Props as ReactSelectProps, StylesConfig } from "react-select";

export type SelectOptionValue = string | number | boolean | Date | null | undefined;

export type SelectOptions<T = SelectOptionValue> = {
  value: T;
  label: string;
  disabled?: boolean;
  metadata?: Record<string, any>;
};

type ReactSelectComponentProps = Omit<
  ReactSelectProps<SelectOptions, boolean, GroupBase<SelectOptions>>,
  "onChange" | "value"
> & {
  onChange?: (newValue: any) => void;
  value?: any;
};

export const customSelectStyle: StylesConfig<SelectOptions, boolean, GroupBase<SelectOptions>> = {
  container: (provided) => ({
    ...provided,
    background: "#c4c4c4",
  })
};

export const ReactSelect = ({
  instanceId,
  options = [],
  placeholder = "Selecione uma opção",
  styles,
  ...selectProps
}: ReactSelectComponentProps) => {
  const isClient = useClient();

  const id = useId();

  if (!isClient) return null;

  return (
    <Select
      instanceId={instanceId ?? id}
      isSearchable
      menuPosition="fixed"
      options={options}
      isOptionDisabled={(option) => !!option.disabled}
      placeholder={placeholder}
      styles={{
        ...customStyle,
        ...styles,
      }}
      noOptionsMessage={() => "Nothing found..."}
      components={{
        NoOptionsMessage: NoOptionsMessage,
        ...selectProps.components,
      }}
      {...selectProps}
    />
  );
};