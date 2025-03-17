import { MonthStructure } from "./months-structure-datefns";

export const getIndicator = (params: MonthStructure) => {
  if (params.isDayInMonth) {
    return params.monthDay;
  }

  if (params.isDayInNextMonth) {
    return params.monthDay - params.daysInMonth;
  }

  if (params.isDayInPreviousMonth) {
    return params.daysInLastMonth + params.monthDay;
  }

  return params.monthDay;
};
