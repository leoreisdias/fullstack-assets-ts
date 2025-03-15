import { addYears, endOfMonth, isAfter, subMonths } from "date-fns";
import { useId } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import * as S from "./styles";
import "react-datepicker/dist/react-datepicker.css";
import { InputDatePicker } from "@/components/form/dates/date-picker";

interface IDatePickerGroupProps {
  start: {
    label?: string;
    name: string;
    disabled?: boolean;
    placeholder?: string;
    mandatory?: boolean;
    onDateChange?: (date: Date | null) => void;
    minDate?: Date;
    maxDate?: Date;
  };
  end: {
    label?: string;
    name: string;
    disabled?: boolean;
    placeholder?: string;
    mandatory?: boolean;
    onDateChange?: (date: Date | null) => void;
  };
  noEndDate?: boolean;
  placement?: "auto";
}

export const InputDatePickerGroup = ({ start, end }: IDatePickerGroupProps) => {
  const { control, setValue, getValues } = useFormContext();

  const startDateId = useId();
  const endDateId = useId();

  const startDateField = useWatch({
    control,
    name: start.name,
  });

  const endDateField = useWatch({
    control,
    name: end.name,
  });

  const onStartChange = (date: Date | null) => {
    if (!date) return;

    const endDate = getValues(end.name);

    if (endDate && isAfter(date as Date, endDate as Date)) {
      setValue(end.name, null);
    }

    start.onDateChange?.(date);
  };

  const onEndChange = (date: Date | null) => {
    end.onDateChange?.(date);
  };

  return (
    <S.Container>
      <S.DateGroup>
        <InputDatePicker
          id={startDateId}
          label={start.label}
          name={start.name}
          placeholder={start.placeholder}
          groupOptions={{
            groupMode: "start",
            startDate: startDateField,
            endDate: endDateField,
          }}
          minDate={start.minDate}
          onChange={onStartChange}
          disabled={start.disabled}
          maxDate={start.maxDate}
        />
      </S.DateGroup>
      <S.DateGroup>
        <InputDatePicker
          label={end.label}
          name={end.name}
          groupOptions={{
            groupMode: "end",
            startDate: startDateField,
            endDate: endDateField,
          }}
          maxDate={startDateField ? subMonths(addYears(endOfMonth(startDateField), 1), 1) : undefined}
          id={endDateId}
          placeholder={end.placeholder}
          minDate={startDateField}
          onChange={onEndChange}
          disabled={end.disabled}
        />
      </S.DateGroup>
    </S.Container>
  );
};
