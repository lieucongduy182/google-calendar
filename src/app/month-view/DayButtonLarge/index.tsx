import React, { memo, useMemo } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import clsx from 'clsx';
import EventListSmall from '@/app/month-view/EventListSmall';
import { Event } from '@/lib/stores/eventStore';
import { DATE_TIME_FORMAT } from '@/app/constants';

type DayButtonLargeProps = {
  date: Dayjs;
  events: Event[];
  currentMonthIndex: number;
  handleSelectedDay: (day: Dayjs) => void;
};

function DayButtonLarge({
  date,
  events,
  currentMonthIndex,
  handleSelectedDay,
}: DayButtonLargeProps) {
  const formattedDate = date.format(DATE_TIME_FORMAT);
  const isCurrent =
    date.month() === currentMonthIndex % 12 && date.year() === dayjs().year();
  const isToday = formattedDate === dayjs().format(DATE_TIME_FORMAT);

  const renderEvents = useMemo(
    () =>
      events.filter(
        (event) => dayjs(event.date).format(DATE_TIME_FORMAT) === formattedDate
      ),
    [events, formattedDate]
  );

  const isHasEvents = !!renderEvents.length;

  const showEventBackground = useMemo(() => {
    if (!isHasEvents) return '';

    return isToday ? 'bg-light-blue' : 'bg-light-orange';
  }, [isHasEvents, isToday]);

  return (
    <div
      className={clsx(
        'flex flex-col items-center border border-gray-200 h-32',
        showEventBackground
      )}
      onClick={(e: React.SyntheticEvent) => {
        e.stopPropagation();
        handleSelectedDay(date);
      }}
    >
      <div className="block mb-1">
        <button
          className={clsx(
            'w-10 h-10 mt-2 text-md rounded-full text-center flex items-center justify-center',
            !isCurrent && 'text-gray-400',
            isToday && 'bg-light-blue text-white'
            // isSelectedDay && 'bg-dark-blue text-white'
          )}
          disabled={!isCurrent}
        >
          {date.format('D')}
        </button>
      </div>

      {renderEvents.map((event) => (
        <EventListSmall key={event.id} event={event} />
      ))}
    </div>
  );
}

export default memo(DayButtonLarge);
