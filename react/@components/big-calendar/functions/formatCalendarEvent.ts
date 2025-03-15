import { addHours, format } from 'date-fns';

import { IResponse } from '@/interfaces';
import { ICalendarEvents } from '@/interfaces/entities/ICalendarEvents';

export const formatCalendarEvent = (event: IResponse<ICalendarEvents[]>) => {
  const newArray = event?.payload?.map((dta: any) => {
    const addHrs = addHours(new Date(dta?.start), 3);
    return {
      day: Number(format(new Date(addHrs), 'dd')),
      events: [
        {
          ...dta,
          dateRef: format(new Date(addHrs), 'dd'),
        },
      ],
    };
  });

  return newArray;
};
