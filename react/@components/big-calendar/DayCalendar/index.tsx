import { useMemo, useState } from 'react';

import { ModalDefault } from '@/components/_generics';
import { useModal } from '@/components/_generics/Modals/Default/useModal';

import { EventDetails } from './EventDetails';
import * as S from './styles';

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
  mutate,
}: DayCalendarProps) => {
  const { open, openModal } = useModal();

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
    const dayEvents = monthEvents?.find(event => event.day === day);

    return {
      dayEvents: dayEvents ? dayEvents.events.slice(0, MAX_EVENTS_PER_DAY) : [],
      countEvents: dayEvents ? dayEvents.events.length : 0,
      hasMoreEvents: dayEvents
        ? dayEvents.events.length > MAX_EVENTS_PER_DAY
        : false,
    };
  }, [day, monthEvents]);

  return (
    <>
      <S.DayCalendarContainer isToday={isToday} onClick={() => openModal()}>
        <S.DayIndicator outside={isDayInNextMonth || isDayInPreviousMonth}>
          {indicator}
        </S.DayIndicator>
        {events.dayEvents.map(event => (
          <S.Event
            key={event.id}
            color={event.color}
            isFinished={event.isFinished}
          >
            <S.EventTitle>{event.title}</S.EventTitle>
          </S.Event>
        ))}
        {events.hasMoreEvents && (
          <S.MoreEvents>
            +{events.countEvents - MAX_EVENTS_PER_DAY}
          </S.MoreEvents>
        )}
      </S.DayCalendarContainer>
      <ModalDefault open={open} onClose={() => close}>
        <EventDetails events={events.dayEvents} day={day} mutate={mutate} />
      </ModalDefault>
    </>
  );
};
