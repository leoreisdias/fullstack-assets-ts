import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";

export type MonthStructure = {
  dateISO: string;
  monthDay: number;
  date: Date;
  isToday: boolean;
  isDayInMonth: boolean;
  isDayInNextMonth: boolean;
  isDayInPreviousMonth: boolean;
};

export const getMonthStructure = (
  currentMonth: number,
  currentYear: number
):MonthStructure[] => {
  const monthStart = startOfMonth(new Date(currentYear, currentMonth));
  const calendarSectionStart = startOfWeek(monthStart, { weekStartsOn: 0 });

  const monthEnd = endOfMonth(new Date(currentYear, currentMonth));
  const calendarSectionEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const totalDaysInSection = eachDayOfInterval({
    start: calendarSectionStart,
    end: calendarSectionEnd,
  });

  const days = totalDaysInSection.map((date) => {
    const dateISO = date.toISOString();
    const dateMonth = date.getMonth();

    const isDayInMonth = dateMonth === currentMonth;
    const isDayInNextMonth = dateMonth > currentMonth;
    const isDayInPreviousMonth = dateMonth < currentMonth;

    const monthDay = date.getDate();

    return {
      dateISO,
      monthDay,
      date,
      isToday: isToday(date),
      isDayInMonth,
      isDayInNextMonth,
      isDayInPreviousMonth,
    };
  });

  return days;
};
