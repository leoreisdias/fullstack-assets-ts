"use client";
import { addMonths, format, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { isHeaderToday } from "./functions/isHeaderToday";
import { MonthEvents } from "./mock";
import { getMonthStructure } from "./functions/daysStructure";
import { Flex, Grid } from "../../styled-system/jsx";
import { css } from "../../styled-system/css";
import { DayCalendar } from "./DayCalendar";

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
    <Flex direction="column" w="100%" gap="4" justify="flex-start">
      <div
        className={css({
          fontSize: "2xl",
          color: "#222",
          fontWeight: 600,
          textTransform: "capitalize",
          mb: "2",
        })}
      >
        {monthDisplay}
      </div>
      <Grid
        w="100%"
        h="100%"
        gridTemplateColumns="repeat(8, 1fr)"
        gap="0"
        className={css({ border: "1px solid #e0e0e0", borderRadius: "md" })}
      >
        <Flex
          direction="row"
          align="center"
          justify="center"
          h="120px"
          border="1px solid #e0e0e0"
          bg="#eaf4fb"
          gap="2"
        >
          <button
            type="button"
            onClick={previousMonth}
            className={css({
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#ced4da80",
              borderRadius: "9999px",
              padding: "0.5rem",
              border: "none",
              cursor: "pointer",
              marginRight: "0.5rem",
              transition: "background 0.2s",
              _hover: { background: "#b0b8c1" },
            })}
          >
            <ArrowLeft size={30} />
          </button>
          <button
            type="button"
            onClick={nextMonth}
            className={css({
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#ced4da80",
              borderRadius: "9999px",
              padding: "0.5rem",
              border: "none",
              cursor: "pointer",
              transition: "background 0.2s",
              _hover: { background: "#b0b8c1" },
            })}
          >
            <ArrowRight size={30} />
          </button>
        </Flex>
        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"].map((day, i) => (
          <Flex
            key={day}
            align="center"
            justify="center"
            h="120px"
            border="1px solid #e0e0e0"
            bg="#eaf4fb"
            fontSize="lg"
            fontWeight="600"
            color={isHeaderToday(i, currentMonthYear) ? "#02e95e" : "#222"}
            style={
              isHeaderToday(i, currentMonthYear)
                ? {
                    border: "2px solid",
                    borderImage:
                      "linear-gradient(96.45deg, #02e95e 5.05%, #0575e6 56.92%) 1",
                  }
                : {}
            }
          >
            {day}
          </Flex>
        ))}
        {MONTH_STRUCTURE.map((props, index) => {
          const showEmptyCard = index % 7 === 0;
          return (
            <>
              {showEmptyCard && (
                <Flex
                  direction="column"
                  align="center"
                  justify="center"
                  h="120px"
                  border="1px solid #e0e0e0"
                  bg="#f5f5f5"
                  w="100%"
                />
              )}
              <DayCalendar
                key={props.monthDay}
                dayProps={{
                  day: props.monthDay,
                  isDayInMonth: props.isDayInMonth,
                  isDayInNextMonth: props.isDayInNextMonth,
                  isDayInPreviousMonth: props.isDayInPreviousMonth,
                  daysInLastMonth: props.daysInLastMonth,
                  daysInMonth: props.daysInMonth,
                  isToday: props.isToday,
                }}
                monthEvents={MonthEvents}
                mutate={() => {}}
              />
            </>
          );
        })}
      </Grid>
    </Flex>
  );
};
