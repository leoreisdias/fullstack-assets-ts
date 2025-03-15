import DatePickerComponent from "react-datepicker";
import { styled } from "styled-system/jsx";

export const Container = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    "& input": {
      color: "#495057 !important",
      paddingLeft: "1rem",
    },
  },
});

export const DatePickerStyled = styled(DatePickerComponent, {
  base: {
    width: "100%",
    height: "44px",
    rounded: "md",
    _disabled: {
      cursor: "not-allowed",
    },
  },
});
