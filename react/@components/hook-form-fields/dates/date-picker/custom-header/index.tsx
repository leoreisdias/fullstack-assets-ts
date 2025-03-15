import React from "react";

import { SelectCalendar } from "./SelectCalendar";

import { styled } from "styled-system/jsx";

const Container = styled("div", {
  base: {
    display: "flex",
    justifyContent: "center",
    fontWeight: "bold",
    gap: "1rem",
    paddingBottom: "2px",
    bg: "#B1BECA",
  },
});

interface CustomHeaderProps {
  date: Date;
  changeYear(year: number): void;
  changeMonth(month: number): void;
  minYear?: number;
}

const months = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export const CustomHeader = ({ date, changeYear, changeMonth, minYear = 2022 }: CustomHeaderProps) => {
  const now = new Date().getUTCFullYear() + 1;

  const years = Array(now - minYear)
    .fill("")
    .map((v, idx) => now - idx);

  const getMonth = (date: Date) => date.getMonth();
  const getYear = (date: Date) => date.getFullYear();

  return (
    <Container>
      <SelectCalendar
        value={{
          value: months[getMonth(date)],
          label: months[getMonth(date)],
        }}
        options={months.map((month) => ({ value: month, label: month }))}
        onChange={(newValue) => changeMonth(months.indexOf(newValue?.value ?? "0"))}
      />
      <SelectCalendar
        value={{
          value: getYear(date),
          label: getYear(date).toString(),
        }}
        options={years.map((year) => ({ value: year, label: year.toString() }))}
        onChange={(newValue) => changeYear(Number(newValue?.value ?? 0))}
      />
    </Container>
  );
};
