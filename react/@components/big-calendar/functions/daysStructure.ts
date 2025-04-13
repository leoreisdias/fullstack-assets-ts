export const getDaysToFulfillMonth = (
  dayOneWeekDay: number,
  daysInMonth: number
) => {
  const totalDays = dayOneWeekDay + daysInMonth;
  const daysToFulfillMonth = totalDays % 7 === 0 ? 0 : 7 - (totalDays % 7);
  return daysToFulfillMonth;
};
