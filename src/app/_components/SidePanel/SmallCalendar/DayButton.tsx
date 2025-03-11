import React, { memo } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import clsx from 'clsx';
import { DATE_TIME_FORMAT } from '@/app/constants';

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
  const isToday =
    date.format(DATE_TIME_FORMAT) === dayjs().format(DATE_TIME_FORMAT);
  const isSelectedDay =
    selectedDay &&
    dayjs(selectedDay).format(DATE_TIME_FORMAT) ===
      date.format(DATE_TIME_FORMAT);
  const isCurrent =
    date.month() === currentMonthIndex % 12 && date.year() === dayjs().year();

  return (
    <button
      className={clsx(
        'w-8 h-8 text-xs rounded-full flex items-center justify-center',
        !isCurrent && 'text-gray-400',
        isToday && 'bg-light-blue text-white',
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
