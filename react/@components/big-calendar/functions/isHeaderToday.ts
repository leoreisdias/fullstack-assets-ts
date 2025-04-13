export const isHeaderToday = (
  day: number,
  currentMonthYear: {
    currentMonth: number;
    currentYear: number;
  }
) => {
  const { currentMonth, currentYear } = currentMonthYear;

  const today = new Date().getDay();
  const month = new Date().getMonth();
  const year = new Date().getFullYear();

  return day === today && month === currentMonth && year === currentYear;
};
