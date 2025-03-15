import { useEffect, useMemo, useState } from 'react';

import { SubTitle } from '@/components/_generics';
import { AddSection } from '@/components/_generics/Form/AddSection';

import { DayEvents } from '..';

import { NewEvent } from '../NewEvent';
import * as S from './styles';

// const getTimeFromISO = (iso: string) => {
//   return format(new Date(iso), 'HH:mm');
// };

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
    <S.Container>
      <SubTitle
        sx={{
          border: 'none',
        }}
      >
        Dia {day}
      </SubTitle>
      {events.map(event => (
        <S.Event key={event.id}>
          <S.EventTime isFinished={event.isFinished}>
            <S.EventFlag color={event.color} isFinished={event.isFinished} />
            {/* <strong>{getTimeFromISO(event.start)}</strong> */}
          </S.EventTime>
          <S.EventTitle isFinished={event.isFinished}>
            {event.title}
          </S.EventTitle>
        </S.Event>
      ))}

      <S.NewEvent>
        <AddSection label="Nova reunião" onClick={() => setNewEvent(true)} />
      </S.NewEvent>
    </S.Container>
  );
};
