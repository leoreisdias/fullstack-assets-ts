import { useMemo } from "react";

import { Box, Flex, styled } from "styled-system/jsx";

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

const DayContainer = styled("div", {
  base: {
    gap: "0.25rem",
    width: "full",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: "1.75rem 2px 0 2px",
    margin: "0",
    height: "120px",
    backgroundColor: "gray.50",
    cursor: "pointer",
    position: "relative",
    border: "1px solid",
    borderColor: "gray.300",
  },
  variants: {
    isToday: {
      true: {
        border: "2px solid",
        borderColor: "blue.500",
      },
    },
  },
});

export const DayCalendar = ({
  dayProps: { day, isDayInNextMonth, isDayInPreviousMonth, isToday },
  monthEvents,
}: DayCalendarProps) => {
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

  const isOutside = isDayInNextMonth || isDayInPreviousMonth;

  return (
    <>
      <DayContainer
        isToday={isToday}
        onClick={() => console.log("Open Events")}
      >
        <Box
          position="absolute"
          top="5px"
          left="5px"
          color={isOutside ? "gray.500" : isToday ? "blue.500" : "gray.700"}
          fontSize="1rem"
          fontWeight="600"
        >
          {day}
        </Box>
        {events.dayEvents.map((event) => (
          <Flex
            w="full"
            align="center"
            justify="flex-start"
            padding="4px"
            margin="0"
            bg={event.isFinished ? "gray.200" : "white"}
            key={event.id}
            color={event.color}
          >
            <p>{event.title}</p>
          </Flex>
        ))}
        {events.hasMoreEvents && (
          <Flex
            w="full"
            align="center"
            justify="center"
            fontSize="md"
            color="gray.500"
            fontWeight="500"
          >
            +{events.countEvents - MAX_EVENTS_PER_DAY}
          </Flex>
        )}
      </DayContainer>
    </>
  );
};
s;
