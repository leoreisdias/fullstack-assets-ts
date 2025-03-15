import {
  addHours,
  addMonths,
  format,
  getDate,
  getDay,
  getDaysInMonth,
  subMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect, useMemo, useState } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

import { useFetch } from "@/hooks/useFetch";
import { IResponse } from "@/interfaces";
import { ICalendarEvents } from "@/interfaces/entities/ICalendarEvents";
import { getAllCalendarEvents } from "@/services/calendar";

import { DayCalendar } from "./DayCalendar";
import { getDaysToFulfillMonth } from "./functions/daysStructure";
import { formatCalendarEvent } from "./functions/formatCalendarEvent";
import { isHeaderToday } from "./functions/isHeaderToday";
import { MonthEvents } from "./mock";
import * as S from "./styles";

export const MyCalendar = () => {
  const [currentMonthYear, setCurrentMonthYear] = useState({
    currentMonth: new Date().getMonth(),
    currentYear: new Date().getFullYear(),
  });

  const monthDisplay = format(
    new Date(currentMonthYear.currentYear, currentMonthYear.currentMonth),
    "MMMM yyyy",
    {
      locale: ptBR,
    }
  );

  const nextMonth = () => {
    const { currentMonth, currentYear } = currentMonthYear;
    const newDate = addMonths(new Date(currentYear, currentMonth), 1);

    setCurrentMonthYear({
      currentMonth: newDate.getMonth(),
      currentYear: newDate.getFullYear(),
    });
  };

  const previousMonth = () => {
    const { currentMonth, currentYear } = currentMonthYear;
    const newDate = subMonths(new Date(currentYear, currentMonth), 1);

    setCurrentMonthYear({
      currentMonth: newDate.getMonth(),
      currentYear: newDate.getFullYear(),
    });
  };

  const MONTH_STRUCTURE = useMemo(() => {
    const { currentMonth, currentYear } = currentMonthYear;

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

      const isToday =
        isDayInMonth &&
        new Date().getDate() === day &&
        todayMonth === currentMonth;

      return {
        day,
        isToday,
        isDayInMonth,
        isDayInNextMonth,
        isDayInPreviousMonth,
        daysInLastMonth,
        daysInMonth,
      };
    });

    return days;
  }, [currentMonthYear]);

  const { data, mutate } = useFetch<
    IResponse<ICalendarEvents[]>,
    IResponse,
    ICalendarEvents[]
  >(
    `/app-service/calendar-events`,
    {
      revalidateOnFocus: true,
    },
    formatCalendarEvent
  );

  return (
    <S.Container>
      <S.Month>{monthDisplay}</S.Month>
      <S.CalendarContainer>
        <S.SwitcherContainer>
          <S.Switcher onClick={previousMonth}>
            <MdKeyboardArrowLeft size={30} />
          </S.Switcher>
          <S.Switcher onClick={nextMonth}>
            <MdKeyboardArrowRight size={30} />
          </S.Switcher>
        </S.SwitcherContainer>
        <S.CalendarHeader isToday={isHeaderToday(0, currentMonthYear)}>
          Dom
        </S.CalendarHeader>
        <S.CalendarHeader isToday={isHeaderToday(1, currentMonthYear)}>
          Seg
        </S.CalendarHeader>
        <S.CalendarHeader isToday={isHeaderToday(2, currentMonthYear)}>
          Ter
        </S.CalendarHeader>
        <S.CalendarHeader isToday={isHeaderToday(3, currentMonthYear)}>
          Qua
        </S.CalendarHeader>
        <S.CalendarHeader isToday={isHeaderToday(4, currentMonthYear)}>
          Qui
        </S.CalendarHeader>
        <S.CalendarHeader isToday={isHeaderToday(5, currentMonthYear)}>
          Sex
        </S.CalendarHeader>
        <S.CalendarHeader isToday={isHeaderToday(6, currentMonthYear)}>
          Sab
        </S.CalendarHeader>
        {MONTH_STRUCTURE.map((props, index) => {
          const showEmptyCard = index % 7 === 0;

          return (
            <>
              {showEmptyCard && <S.EmptyCard />}
              <DayCalendar
                key={props.day}
                dayProps={props}
                monthEvents={data}
                mutate={mutate}
              />
            </>
          );
        })}
      </S.CalendarContainer>
    </S.Container>
  );
};
