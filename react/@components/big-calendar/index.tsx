"use client";
import { addMonths, format, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import React, { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { isHeaderToday } from "./functions/isHeaderToday";
import { MonthEvents } from "./mock";
import { DayCalendar, type DayEvents } from "./day-calendar";
import { getMonthStructure } from "@/utils/calendar-handlers/months-structure-datefns";
import { Flex, Grid, Box, styled } from "styled-system/jsx";

// Estilos para o CalendarHeader com a prop isToday

const CalendarHeader = styled("div", {
  base: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: "0",
    margin: "0",
    height: "120px",
    border: "1px solid",
    borderColor: "gray.300",
    backgroundColor: "blue.50",
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "gray.800",
  },
  variants: {
    isToday: {
      true: {
        border: "2px solid",
        borderImageSource:
          "linear-gradient(96.45deg, #02e95e 5.05%, #0575e6 56.92%)",
        borderImageSlice: "1",
      },
    },
  },
});

// Adaptando o formato dos dados para o formato esperado pelo DayCalendar
const data = MonthEvents.map((event) => ({
  day: event.day,
  events: event.events as DayEvents[],
}));

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
    // Adaptando o formato retornado pelo getMonthStructure para o formato esperado pelo DayCalendar
    return getMonthStructure(
      currentMonthYear.currentMonth,
      currentMonthYear.currentYear
    ).map((item) => ({
      day: item.monthDay,
      isDayInMonth: item.isDayInMonth,
      isDayInNextMonth: item.isDayInNextMonth,
      isDayInPreviousMonth: item.isDayInPreviousMonth,
      daysInLastMonth: item.daysInLastMonth,
      daysInMonth: item.daysInMonth,
      isToday: item.isToday,
    }));
  }, [currentMonthYear]);

  // Função para simular o mutate que está faltando
  const mutate = () => {
    // Implementação vazia para resolver o erro
    console.log("Mutate called");
  };

  return (
    <Flex width="100%" flexDirection="column" gap="1rem" justify="flex-start">
      <Box
        fontSize="2rem"
        color="gray.800"
        fontWeight="600"
        textTransform="capitalize"
      >
        {monthDisplay}
      </Box>
      <Grid
        width="100%"
        height="100%"
        gridTemplateColumns="repeat(8, 1fr)"
        gap={0}
      >
        <Flex
          flexDirection="row"
          width="100%"
          alignItems="center"
          justifyContent="center"
          padding="0"
          margin="0"
          height="120px"
          border="1px solid"
          borderColor="gray.300"
          backgroundColor="blue.50"
          gap="0.5rem"
        >
          <Flex
            cursor="pointer"
            width="fit-content"
            padding="0.25rem"
            alignItems="center"
            justifyContent="center"
            backgroundColor="rgba(206, 212, 218, 0.5)"
            borderRadius="50%"
            onClick={previousMonth}
          >
            <ChevronLeft size={30} />
          </Flex>
          <Flex
            cursor="pointer"
            width="fit-content"
            padding="0.25rem"
            alignItems="center"
            justifyContent="center"
            backgroundColor="rgba(206, 212, 218, 0.5)"
            borderRadius="50%"
            onClick={nextMonth}
          >
            <ChevronRight size={30} />
          </Flex>
        </Flex>
        <CalendarHeader isToday={isHeaderToday(0, currentMonthYear)}>
          Dom
        </CalendarHeader>
        <CalendarHeader isToday={isHeaderToday(1, currentMonthYear)}>
          Seg
        </CalendarHeader>
        <CalendarHeader isToday={isHeaderToday(2, currentMonthYear)}>
          Ter
        </CalendarHeader>
        <CalendarHeader isToday={isHeaderToday(3, currentMonthYear)}>
          Qua
        </CalendarHeader>
        <CalendarHeader isToday={isHeaderToday(4, currentMonthYear)}>
          Qui
        </CalendarHeader>
        <CalendarHeader isToday={isHeaderToday(5, currentMonthYear)}>
          Sex
        </CalendarHeader>
        <CalendarHeader isToday={isHeaderToday(6, currentMonthYear)}>
          Sab
        </CalendarHeader>
        {MONTH_STRUCTURE.map((props, index) => {
          const showEmptyCard = index % 7 === 0;

          return (
            <React.Fragment key={index}>
              {showEmptyCard && (
                <Flex
                  flexDirection="column"
                  width="100%"
                  alignItems="center"
                  justifyContent="center"
                  padding="0"
                  margin="0"
                  height="120px"
                  border="1px solid"
                  borderColor="gray.300"
                  backgroundColor="gray.100"
                />
              )}
              <DayCalendar
                key={`day-${index}`}
                dayProps={props}
                monthEvents={data}
                mutate={mutate}
              />
            </React.Fragment>
          );
        })}
      </Grid>
    </Flex>
  );
};
