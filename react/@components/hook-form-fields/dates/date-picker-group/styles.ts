import DatePickerComponent from "react-datepicker";
import { styled } from "styled-system/jsx";

export const Container = styled("div", {
  base: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    gap: "0.5rem",
    "& input": {
      paddingLeft: "1rem",
    },
    "@media (max-width: 425px)": {
      flexDirection: "column",
    },
  },
});

export const DateGroup = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
  },
});

export const DatePickerStyled = styled(DatePickerComponent, {
  base: {
    width: "100%",
    height: "50px",
    color: "#495057 !important",
  },
});
