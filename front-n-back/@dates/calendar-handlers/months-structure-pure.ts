const WEEK_DAYS = 7;

const getAmountToFulfillCalendar = (
  dayOneWeekDay: number,
  daysInMonth: number
) => {
  const totalDays = dayOneWeekDay + daysInMonth;
  const daysLeftInWeek = totalDays % WEEK_DAYS;
  return daysLeftInWeek === 0 ? 0 : WEEK_DAYS - daysLeftInWeek;
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

    const monthDay = getIndicator({
      day,
      isDayInMonth,
      isDayInNextMonth,
      isDayInPreviousMonth,
      daysInLastMonth,
      daysInMonth,
    });

    return {
      dateISO,
      monthDay,
      date,
      isToday,
      isDayInMonth,
      isDayInNextMonth,
      isDayInPreviousMonth,
    };
  });

  return days;
};
