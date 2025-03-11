'use client';

import { memo, useMemo } from 'react';
import SmallCalendar from '@/app/_components/SidePanel/SmallCalendar';
import EventList from '@/app/_components/SidePanel/EventList';
import { useMonthCalendar } from '@/app/_hooks/useMonthCalendar';
import clsx from 'clsx';
import { useEventStore } from '@/lib/stores/eventStore';
import { useSelectedDayStore } from '@/lib/stores/selectedDayStore';
import dayjs from 'dayjs';
import {
  DATE_TIME_FORMAT,
  DAYS_OF_WEEK,
  DAYS_OF_WEEK_FORMAT,
} from '@/app/constants';

function SidePanel() {
  const daysOfWeek = Array.from({ length: DAYS_OF_WEEK }, (_, i) =>
    dayjs().day(i).format(DAYS_OF_WEEK_FORMAT).toUpperCase()
  );
  const { currentMonth, monthIndex, handleForwardMonth, handlePrevMonth } =
    useMonthCalendar();
  const events = useEventStore((state) => state.events);
  const selectedDay = useSelectedDayStore((state) => state.selectedDay);

  const renderEvents = useMemo(
    () =>
      events.filter(
        (event) =>
          dayjs(event.date).format(DATE_TIME_FORMAT) ===
          selectedDay?.format(DATE_TIME_FORMAT)
      ),
    [selectedDay, events]
  );
  return (
    <section className={clsx('bg-white rounded-xl block h-fit')}>
      <SmallCalendar
        currentMonth={currentMonth}
        currentMonthIndex={monthIndex}
        handleForwardMonth={handleForwardMonth}
        handlePrevMonth={handlePrevMonth}
        daysOfWeek={daysOfWeek}
      />

      <hr className="w-full text-dark-blue" />

      <EventList events={renderEvents} />
    </section>
  );
}

export default memo(SidePanel);
