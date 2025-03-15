/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef } from "react";
import { PatternFormat } from "react-number-format";
import { css } from "styled-system/css";

export const CustomInput = forwardRef((props: any, _) => {
  return <PatternFormat format="##/##/####" {...props} />;
});
