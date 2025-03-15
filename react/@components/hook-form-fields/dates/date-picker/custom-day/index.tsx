import React from "react";
import { Box } from "styled-system/jsx";

interface CustomDayProps {
  dayOfMonth: any;
  date: any;
}

export const CustomDay = ({ dayOfMonth }: CustomDayProps) => {
  return <Box fontWeight={500}>{dayOfMonth}</Box>;
};
