import { useState } from "react";
import { Box, Flex } from "../../../../styled-system/jsx";
import { css } from "../../../../styled-system/css";
import { DayEvents } from "..";
import { NewEvent } from "../NewEvent";

export const EventDetails = ({
  events,
  day,
  mutate,
}: {
  events: DayEvents[];
  day: number;
  mutate: () => void;
}) => {
  const [newEvent, setNewEvent] = useState(false);

  if (newEvent) {
    return (
      <NewEvent
        onCancel={() => {
          setNewEvent(false);
        }}
        mutate={mutate}
      />
    );
  }

  return (
    <Box p="4" borderRadius="md" bg="#fff" minW="320px">
      <h3
        className={css({
          fontSize: "xl",
          fontWeight: "bold",
          marginBottom: "1rem",
          border: "none",
          color: "#0575e6",
        })}
      >
        Dia {day}
      </h3>
      {events.map((event) => (
        <Flex
          key={event.id}
          direction="row"
          align="center"
          gap="2"
          mb="2"
          p="2"
          borderRadius="sm"
          bg={event.isFinished ? "#e0e0e0" : "#f5faff"}
          boxShadow="sm"
        >
          <Box
            w="8px"
            h="24px"
            borderRadius="full"
            bg={event.isFinished ? "#b0b8c1" : event.color}
            mr="2"
          />
          <Box
            fontWeight="bold"
            color={event.isFinished ? "#b0b8c1" : "#0575e6"}
            fontSize="sm"
            flex="1"
          >
            {event.title}
          </Box>
        </Flex>
      ))}
      <Box mt="4">
        <button
          onClick={() => setNewEvent(true)}
          style={{
            background: "#0575e6",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "8px 16px",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          Nova reunião
        </button>
      </Box>
    </Box>
  );
};
