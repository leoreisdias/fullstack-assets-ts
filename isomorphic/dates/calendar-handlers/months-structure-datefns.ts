import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
  getDaysInMonth,
} from "date-fns";
import { getIndicator } from "./get-indicator";

export type MonthStructure = {
  dateISO: string;
  monthDay: number;
  date: Date;
  isToday: boolean;
  isDayInMonth: boolean;
  isDayInNextMonth: boolean;
  isDayInPreviousMonth: boolean;
  daysInLastMonth: number;
  daysInMonth: number;
  indicator: number;
};

export const getMonthStructure = (
  currentMonth: number,
  currentYear: number
): MonthStructure[] => {
  const monthStart = startOfMonth(new Date(currentYear, currentMonth));
  const calendarSectionStart = startOfWeek(monthStart, { weekStartsOn: 0 });

  const monthEnd = endOfMonth(new Date(currentYear, currentMonth));
  const calendarSectionEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const totalDaysInSection = eachDayOfInterval({
    start: calendarSectionStart,
    end: calendarSectionEnd,
  });

  const lastMonth = subMonths(
    new Date(currentYear, currentMonth),
    1
  ).getMonth();

  const daysInLastMonth = getDaysInMonth(new Date(currentYear, lastMonth));
  const daysInMonth = getDaysInMonth(new Date(currentYear, currentMonth));

  const days = totalDaysInSection.map((date) => {
    const dateISO = date.toISOString();
    const dateMonth = date.getMonth();

    const isDayInMonth = dateMonth === currentMonth;
    const isDayInNextMonth = dateMonth > currentMonth;
    const isDayInPreviousMonth = dateMonth < currentMonth;

    const monthDay = date.getDate();
    const data = {
      dateISO,
      monthDay,
      date,
      isToday: isToday(date),
      isDayInMonth,
      isDayInNextMonth,
      isDayInPreviousMonth,
      daysInLastMonth,
      daysInMonth,
      indicator: 0,
    };

    const indicator = getIndicator(data);

    return { ...data, indicator };
  });

  return days;
};
