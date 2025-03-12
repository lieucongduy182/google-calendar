import type { Event } from '@/lib/stores/eventStore';
import dayjs from 'dayjs';
import React, { memo, useMemo } from 'react';
import EventItem from '../EventItem';
import { useSelectedDayStore } from '@/lib/stores/selectedDayStore';
import { DATE_TIME_FORMAT } from '@/app/constants';
import Link from 'next/link';

type EventListProps = {
  events: Event[];
};

const CUSTOM_DATE_FORMAT = 'ddd, DD MMM';

function EventList({ events }: EventListProps) {
  const selectedDay = useSelectedDayStore((state) => state.selectedDay);
  const displayDate = useMemo(() => {
    if (
      selectedDay?.format(DATE_TIME_FORMAT) === dayjs().format(DATE_TIME_FORMAT)
    )
      return `Today, ${dayjs(selectedDay).format('DD MMM')}`;

    return dayjs(selectedDay).format(CUSTOM_DATE_FORMAT);
  }, [selectedDay]);
  return (
    <div className="p-4">
      <div>
        <div className="flex items-center justify-between">
          <p className="text-left text-dark-blue font-bold">
            {dayjs(selectedDay).isBefore(dayjs(), 'day')
              ? 'History Events'
              : 'Upcoming Events'}
          </p>
          <Link
            className="md:hidden px-2 py-2 text-xs bg-dark-blue text-white rounded-full"
            href="/month-view"
          >
            View All
          </Link>
        </div>
        <p className="text-left font-semibold text-gray-400">{displayDate}</p>
      </div>

      {events.length > 0 ? (
        <div className="mt-3 flex flex-col gap-2">
          {events.map((event) => (
            <EventItem key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-400">No events</p>
        </div>
      )}
    </div>
  );
}

export default memo(EventList);
