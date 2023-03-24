import { getDay, getDaysInMonth, subMonths } from "date-fns";

const getDaysToFulfillMonth = (dayOneWeekDay: number, daysInMonth: number) => {
  const totalDays = dayOneWeekDay + daysInMonth;
  const daysToFulfillMonth = totalDays % 7 === 0 ? 0 : 7 - (totalDays % 7);
  return daysToFulfillMonth;
};

const getIndicator = (params: {
  day: number;
  isDayInMonth: boolean;
  isDayInNextMonth: boolean;
  isDayInPreviousMonth: boolean;
  daysInLastMonth: number;
  daysInMonth: number;
}) => {
  if (params.isDayInMonth) {
    return params.day;
  }

  if (params.isDayInNextMonth) {
    return params.day - params.daysInMonth;
  }

  if (params.isDayInPreviousMonth) {
    return params.daysInLastMonth + params.day;
  }

  return params.day;
};

export const getMonthStructure = (
  currentMonth: number,
  currentYear: number
) => {
  const dayOneWeekDay = getDay(new Date(currentYear, currentMonth, 1));
  const daysInMonth = getDaysInMonth(new Date(currentYear, currentMonth));

  const totalDaysInMonth = dayOneWeekDay + daysInMonth;

  const totalCards =
    totalDaysInMonth + getDaysToFulfillMonth(dayOneWeekDay, daysInMonth);

  const lastMonth = subMonths(
    new Date(currentYear, currentMonth),
    1
  ).getMonth();
  const daysInLastMonth = getDaysInMonth(new Date(currentYear, lastMonth));

  const days = Array.from({ length: totalCards }, (_, index) => {
    const day = index - dayOneWeekDay + 1;
    const isDayInMonth = day > 0 && day <= daysInMonth;
    const isDayInNextMonth = day > daysInMonth;
    const isDayInPreviousMonth = day <= 0;

    const todayMonth = new Date().getMonth();

    const date = new Date(currentYear, currentMonth, day);

    const isToday =
      isDayInMonth &&
      new Date().getDate() === day &&
      todayMonth === currentMonth;

    const indicator = getIndicator({
      day,
      isDayInMonth,
      isDayInNextMonth,
      isDayInPreviousMonth,
      daysInLastMonth,
      daysInMonth,
    });

    return {
      day,
      indicator,
      date,
      isToday,
      isDayInMonth,
      isDayInNextMonth,
      isDayInPreviousMonth,
      daysInLastMonth,
      daysInMonth,
    };
  });

  return days;
};
