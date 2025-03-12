import React, { memo, useMemo } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import clsx from 'clsx';
import { DATE_TIME_FORMAT } from '@/app/constants';
import { useEventModal } from '@/app/_hooks/useEventModal';

type DayButtonProps = {
  date: Dayjs;
  currentMonthIndex: number;
  selectedDay: Dayjs | null;
  handleSelectedDay: (day: Dayjs) => void;
};

const DayButton = ({
  date,
  currentMonthIndex,
  selectedDay,
  handleSelectedDay,
}: DayButtonProps) => {
  const formattedDate = date.format(DATE_TIME_FORMAT);
  const isToday = formattedDate === dayjs().format(DATE_TIME_FORMAT);
  const isSelectedDay =
    selectedDay &&
    dayjs(selectedDay).format(DATE_TIME_FORMAT) === formattedDate;
  const isCurrent = date.month() === currentMonthIndex % 12;
  const { events } = useEventModal();
  const renderEvents = useMemo(
    () =>
      events.filter(
        (event) => dayjs(event.date).format(DATE_TIME_FORMAT) === formattedDate
      ),
    [events, formattedDate]
  );
  const isHasEvents = !!renderEvents.length;
  const showEventBackground = useMemo(() => {
    if (!isHasEvents || isSelectedDay) return '';

    return isToday
      ? 'bg-light-blue text-white'
      : 'bg-light-orange text-gray-400';
  }, [isHasEvents, isToday, isSelectedDay]);

  return (
    <button
      className={clsx(
        'w-8 h-8 text-xs rounded-full flex items-center justify-center',
        !isCurrent && 'text-gray-400',
        showEventBackground,
        isSelectedDay && 'bg-dark-blue text-white'
      )}
      onClick={() => handleSelectedDay(date)}
      disabled={!isCurrent}
    >
      {date.format('D')}
    </button>
  );
};

export default memo(DayButton);
