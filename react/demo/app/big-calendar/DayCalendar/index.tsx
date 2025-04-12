import { useMemo } from "react";
import { Box, Flex } from "../../../styled-system/jsx";

export type DayEvents = {
  id: string;
  title: string;
  start: string;
  end: string;
  color: string;
  isFinished?: boolean;
};

type DayCalendarProps = {
  dayProps: {
    day: number;
    isDayInMonth: boolean;
    isDayInNextMonth: boolean;
    isDayInPreviousMonth: boolean;
    daysInLastMonth: number;
    daysInMonth: number;
    isToday: boolean;
  };
  monthEvents: {
    day: number;
    events: DayEvents[];
  }[];
  mutate: () => void;
};

const MAX_EVENTS_PER_DAY = 2;

export const DayCalendar = ({
  dayProps: {
    day,
    daysInLastMonth,
    daysInMonth,
    isDayInMonth,
    isDayInNextMonth,
    isDayInPreviousMonth,
    isToday,
  },
  monthEvents,
}: DayCalendarProps) => {
  // Modal removido para simplificação do demo
  const indicator = useMemo(() => {
    if (isDayInMonth) {
      return day;
    }
    if (isDayInNextMonth) {
      return day - daysInMonth;
    }
    if (isDayInPreviousMonth) {
      return daysInLastMonth + day;
    }
    return day;
  }, [
    day,
    daysInLastMonth,
    daysInMonth,
    isDayInMonth,
    isDayInNextMonth,
    isDayInPreviousMonth,
  ]);

  const events = useMemo(() => {
    const dayEvents = monthEvents?.find((event) => event.day === day);

    return {
      dayEvents: dayEvents ? dayEvents.events.slice(0, MAX_EVENTS_PER_DAY) : [],
      countEvents: dayEvents ? dayEvents.events.length : 0,
      hasMoreEvents: dayEvents
        ? dayEvents.events.length > MAX_EVENTS_PER_DAY
        : false,
    };
  }, [day, monthEvents]);

  return (
    <Flex
      direction="column"
      gap="1"
      w="100%"
      align="flex-start"
      justify="flex-start"
      p="4"
      m="0"
      h="120px"
      border={isToday ? "2px solid #0575e6" : "1px solid #e0e0e0"}
      bg="#fff"
      position="relative"
      cursor="pointer"
      borderRadius="md"
      onClick={() => {}} // Modal removido
    >
      <Box
        position="absolute"
        top="5px"
        left="5px"
        color={
          isDayInNextMonth || isDayInPreviousMonth
            ? "#b0b8c1"
            : isToday
              ? "#0575e6"
              : "#222"
        }
        fontSize="md"
        fontWeight="600"
      >
        {indicator}
      </Box>
      {events.dayEvents.map((event) => (
        <Flex
          key={event.id}
          direction="row"
          w="100%"
          align="center"
          justify="flex-start"
          p="1"
          m="0"
          bg={event.isFinished ? "#e0e0e0" : event.color ?? "#e57373"}
          color={event.isFinished ? "#b0b8c1" : "#fff"}
          textDecoration={event.isFinished ? "line-through" : "none"}
          borderRadius="sm"
          boxShadow="sm"
          cursor="pointer"
          fontSize="sm"
          mb="1"
        >
          <Box
            fontSize="xs"
            overflowX="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            maxW="100px"
            pointerEvents="none"
          >
            {event.title}
          </Box>
        </Flex>
      ))}
      {events.hasMoreEvents && (
        <Box
          cursor="pointer"
          mt="1"
          display="flex"
          flexDirection="row"
          w="100%"
          alignItems="center"
          justifyContent="center"
          fontSize="md"
          color="#b0b8c1"
          fontWeight="500"
        >
          +{events.countEvents - MAX_EVENTS_PER_DAY}
        </Box>
      )}
    </Flex>
  );
};
