import { getIndicator } from "./get-indicator";
import { MonthStructure } from "./months-structure-datefns";

const WEEK_DAYS = 7;

const getAmountToFulfillCalendar = (
  dayOneWeekDay: number,
  daysInMonth: number
) => {
  const totalDays = dayOneWeekDay + daysInMonth;
  const daysLeftInWeek = totalDays % WEEK_DAYS;
  return daysLeftInWeek === 0 ? 0 : WEEK_DAYS - daysLeftInWeek;
};

export const getMonthStructure = (
  currentMonth: number,
  currentYear: number
): MonthStructure[] => {
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);

  const firstDayOfMonthWeekday = firstDayOfMonth.getDay();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const daysInNextMonth = getAmountToFulfillCalendar(
    firstDayOfMonthWeekday,
    daysInMonth
  );

  const totalAmount = firstDayOfMonthWeekday + daysInMonth + daysInNextMonth;

  const lastMonth = new Date(currentYear, currentMonth - 1).getMonth();

  const daysInLastMonth = new Date(currentYear, lastMonth + 1, 0).getDate();

  const days = Array.from({ length: totalAmount }, (_, index) => {
    const day = index - firstDayOfMonthWeekday + 1;
    const date = new Date(currentYear, currentMonth, day);
    const dateISO = date.toISOString();

    const isDayInMonth = day > 0 && day <= daysInMonth;
    const isDayInNextMonth = day > daysInMonth;
    const isDayInPreviousMonth = day <= 0;

    const today = new Date();
    const isToday = isDayInMonth && today.getDate() === day;

    const data = {
      dateISO,
      monthDay: day,
      date,
      isToday,
      isDayInMonth,
      isDayInNextMonth,
      isDayInPreviousMonth,
      indicator: 0,
      daysInLastMonth,
      daysInMonth,
    };

    const indicator = getIndicator(data);

    return { ...data, indicator };
  });

  return days;
};
