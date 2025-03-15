import { GroupBase, StylesConfig } from "react-select";

export type SelectOptionValue =
  | string
  | number
  | boolean
  | Date
  | null
  | undefined;

export type SelectOptions<T = SelectOptionValue> = {
  value: T;
  label: string;
  name?: string;
  disabled?: boolean;
};

export const customSelectStyle: StylesConfig<
  SelectOptions,
  boolean,
  GroupBase<SelectOptions>
> = {
  container: (provided) => ({
    ...provided,
    color: "#495057",
    background: "#f9f9fb",
    fontFamily: "Montserrat",
  }),
  input: (provided) => ({
    ...provided,
    // sxInput,
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#a7a8a8",
  }),
  control: (provided) => ({
    ...provided,
    fontFamily: "Montserrat",
    boxShadow: "none",
    borderColor: "#CED4DA",
    borderRadius: "0.25rem",
    height: "44px",
    background: "#f9f9fb",
  }),
  multiValue: (provided) => ({
    ...provided,
    background: "#CDE3FA",
  }),
  clearIndicator: (provided) => ({
    ...provided,
    cursor: "pointer",
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    cursor: "pointer",
  }),
};
