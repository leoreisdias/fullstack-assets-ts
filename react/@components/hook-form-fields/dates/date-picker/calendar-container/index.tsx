import React from "react";
import { CalendarContainerProps } from "react-datepicker";

import * as S from "./styles";

export const CustomCalendarContainer = ({
  className,
  children,
}: CalendarContainerProps) => {
  return (
    <S.Container
      className={className}
      css={{
        zIndex: "999999 !important",
        "& .react-datepicker__header--custom": {
          background: "#B1BECA !important",
          border: "none",
          padding: "0",
        },
        "& .react-datepicker__day-names": {
          background: "#B1BECA",
          fontWeight: 600,
          cursor: "default",
          marginBottom: "2px",
          w: "full",
        },
        "& .react-datepicker__day": {
          border: "solid 1px transparent",
          fontSize: "0.875rem",
          fontWeight: 400,
          fontFamily: "Montserrat, sans-serif",
          _hover: {
            borderColor: "rgba(209, 226, 243, 1)",
            background: "transparent",
          },
          _selected: {
            background: "rgba(209, 226, 243, 1)",
            color: "initial",
          },
          "& --outside-month": {
            color: "rgba(0, 0, 0, 0.527)",
          },
          "& --disabled": {
            color: "rgba(0, 0, 0, 0.2)",
            cursor: "default",
          },
        },
        "& .react-datepicker__month-container": {
          w: "full",
          float: "none",
          fontFamily: "Montserrat, sans-serif",
        },
      }}
    >
      {children}
      <S.ActionFooterContainer></S.ActionFooterContainer>
    </S.Container>
  );
};
