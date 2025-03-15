"use client";
import { motion } from "motion/react";
import { forwardRef } from "react";
import {
  Flex,
  Grid,
  FlexProps,
  GridProps,
  BoxProps,
  Box,
} from "styled-system/jsx";

const ForwardedFlex = forwardRef<HTMLDivElement, FlexProps>((props, ref) => (
  <Flex {...props} ref={ref} />
));

export const FlexMotion = motion.create(ForwardedFlex);

const ForwardedGrid = forwardRef<HTMLDivElement, GridProps>((props, ref) => (
  <Grid {...props} ref={ref} />
));
export const GridMotion = motion.create(ForwardedGrid);

const ForwaredBox = forwardRef<HTMLDivElement, BoxProps>((props, ref) => (
  <Box {...props} ref={ref} />
));

export const BoxMotion = motion.create(ForwaredBox);
