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

/* 
Main TimeZones: 
America/New_York
America/Los_Angeles
America/Chicago
America/Denver
America/Toronto
Europe/London
Europe/Paris
Europe/Berlin
Asia/Tokyo
Asia/Shanghai
Australia/Sydney
Africa/Cairo
Pacific/Honolulu 

Others: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
  */

export const getDateAmericaSP = (): Date => {
    const today = new Date();
    const timezone = 'America/Sao_Paulo';

    const desiredDate = utcToZonedTime(today, timezone);

    return desiredDate;
};
