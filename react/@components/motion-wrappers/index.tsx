import { Box, type BoxProps, Flex, type FlexProps, Grid, type GridProps } from '@styled-system/jsx'
import { motion } from 'framer-motion'
import { forwardRef } from 'react'

const MotionFlex = motion(
  forwardRef<HTMLDivElement, FlexProps>((props, ref) => <Flex ref={ref} {...props} />)
)

const MotionBox = motion(
  forwardRef<HTMLDivElement, BoxProps>((props, ref) => <Box ref={ref} {...props} />)
)

const MotionGrid = motion(
  forwardRef<HTMLDivElement, GridProps>((props, ref) => <Grid ref={ref} {...props} />)
)

// Exporta com tipagem correta e mantém o CSS declarativo
export { MotionFlex as FlexMotion, MotionBox as BoxMotion, MotionGrid as GridMotion }
