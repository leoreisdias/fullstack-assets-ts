import { addMonths, format, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { isHeaderToday } from "./functions/isHeaderToday";
import { MonthEvents } from "./mock";
import { getMonthStructure } from "../../utils/months-structure-datefns";
import { Flex, Grid } from "../../../styled-system/jsx";
import { css } from "../../../styled-system/css";
import { DayCalendar } from "./DayCalendar";

const data = {
  payload: MonthEvents,
};

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
    return getMonthStructure(
      currentMonthYear.currentMonth,
      currentMonthYear.currentYear
    );
  }, [currentMonthYear]);

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
