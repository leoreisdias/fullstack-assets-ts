// NOTE: Originally from ParkUI: https://park-ui.com/react/docs/typography/text
// It's the same of ParkUI, but I have FOMO and I want to have it in my own library in case it goes down.
import { forwardRef, useMemo } from "react";
import { styled } from "styled-system/jsx";
import { TextVariantProps, text } from "styled-system/recipes";
import { HTMLStyledProps, StyledComponent } from "styled-system/types";

type As =
  | "p"
  | "span"
  | "div"
  | "label"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "strong"
  | "small";

export type TextProps = {
  as?: As;
} & TextVariantProps &
  HTMLStyledProps<As>;

export const Text = forwardRef<HTMLHeadingElement, TextProps>((props, ref) => {
  const { as = "p", ...localProps } = props;
  const Dynamic = useMemo(() => styled(as, text) as StyledComponent<As>, [as]);

  return <Dynamic ref={ref} {...localProps} />;
});

Text.displayName = "Text";
