import { addYears, parseISO } from "date-fns";
import { registerLocale } from "react-datepicker";
import { useFormContext } from "react-hook-form";

import { CustomCalendarContainer } from "./calendar-container";
import { CustomDay } from "./custom-day";
import { CustomHeader } from "./custom-header";
import { CustomInput } from "./custom-input";
import * as S from "./styles";

import "react-datepicker/dist/react-datepicker.css";
import { ptBR } from "date-fns/locale";
import { formatDate } from "@/utils/functions/dates";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form";
registerLocale("ptBR", ptBR);

type IDatePickerProps = {
  name: string;
  onChange?: (date: Date | null) => void;
  disabled?: boolean;
  id?: string;
  placeholder?: string;
  format?: string;
  minDate?: Date | null;
  label?: string;
  description?: string;
  groupOptions?: {
    groupMode: "end" | "start";
    startDate: Date | null;
    endDate: Date | null;
  };
  maxDate?: Date;
};

export const InputDatePicker = ({
  name,
  id,
  disabled,
  placeholder,
  format,
  minDate,
  onChange,
  label,
  description,
  groupOptions,
  maxDate,
}: IDatePickerProps) => {
  const { control } = useFormContext();

  return (
    <Form.FormField
      name={name}
      control={control}
      render={({ field }) => (
        <Form.FormItem
          data-disabled={disabled ? "true" : undefined}
          _disabled={{
            opacity: 0.8,
            cursor: "not-allowed",
          }}
        >
          <Form.FormLabel>{label}</Form.FormLabel>
          <Form.FormControl>
            <S.DatePickerStyled
              pl={4}
              disabled={disabled}
              id={id ?? name}
              startDate={groupOptions?.startDate}
              endDate={groupOptions?.endDate}
              selectsStart={groupOptions?.groupMode === "start"}
              selectsEnd={groupOptions?.groupMode === "end"}
              selected={
                format && field.value ? parseISO(field.value) : field.value
              }
              minDate={minDate}
              placeholderText={placeholder}
              onChange={(date) => {
                field.onChange(
                  format ? formatDate(date as Date, format) : date
                );
                onChange?.(date as Date);
              }}
              maxDate={maxDate ?? addYears(new Date(), 10)}
              dateFormat="dd/MM/yyyy"
              locale={ptBR}
              formatWeekDay={(nameOfDay) =>
                nameOfDay.substring(0, 1).toLocaleUpperCase()
              }
              todayButton="Hoje"
              renderCustomHeader={(props) => (
                <CustomHeader
                  {...props}
                  minYear={minDate ? minDate.getUTCFullYear() - 1 : undefined}
                />
              )}
              renderDayContents={(dayOfMonth, date) => (
                <CustomDay dayOfMonth={dayOfMonth} date={date} />
              )}
              customInput={<CustomInput />}
              calendarContainer={CustomCalendarContainer}
            />
          </Form.FormControl>
          <Form.FormDescription>{description}</Form.FormDescription>
          <Form.FormMessage />
        </Form.FormItem>
      )}
    />
  );
};
