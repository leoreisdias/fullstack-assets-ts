import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export const getDateWithoutTZ: (
  date?: Date | string,
  options?: { zeroHour?: boolean }
) => Date = (date = new Date(), options = {}) => {
  const newDate = new Date(date).toISOString().replace("Z", "");

  if (options.zeroHour) return parseISO(newDate.split("T")[0]);

  return parseISO(newDate);
};

export const formatDate = (
  date: Date | string | null | undefined,
  pattern = "dd/MM/yyyy"
) => {
  if (!date) return "";

  const dayMonthYear = getDateWithoutTZ(date);

  return format(dayMonthYear, pattern, {
    locale: ptBR,
  });
};
