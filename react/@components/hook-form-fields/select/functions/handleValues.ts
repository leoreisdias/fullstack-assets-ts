import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { MultiValue, SingleValue } from "react-select";
import { SelectOptions } from "../shared";

export const getValueChanged = (
  newValue: MultiValue<SelectOptions> | SingleValue<SelectOptions>,
  isMulti: boolean
) => {
  if (isMulti)
    return (newValue as MultiValue<SelectOptions>).map(
      (option) => option.value
    );

  return (newValue as SingleValue<SelectOptions>)?.value;
};

export const getValue = (
  isMulti: boolean,
  options: SelectOptions[],
  field: ControllerRenderProps<FieldValues, string>
) => {
  if (isMulti)
    return options.filter((item: any) => field.value?.includes(item.value));

  return options.find((option) => option.value === field.value);
};
