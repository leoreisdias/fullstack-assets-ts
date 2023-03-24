import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export const getDateWithoutTZ: (date?: Date | string) => Date = (
  date = new Date()
) => {
  const newDate = new Date(date).toISOString().split("T")[0];

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
