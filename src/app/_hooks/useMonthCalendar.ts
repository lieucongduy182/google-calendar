'use client';

import dayjs from 'dayjs';
import { useMonthStore } from '@/lib/stores/monthStore';
import { useCallback, useEffect, useState } from 'react';

function getMonth(month = dayjs().month()) {
  const year = dayjs().year();
  const firstDayOfTheMonth = dayjs(new Date(year, month)).day();
  let currentMonthCount = 0 - firstDayOfTheMonth;
  const daysMatrix = new Array(5).fill([]).map(() => {
    return new Array(7).fill(null).map(() => {
      currentMonthCount++;
      return dayjs(new Date(year, month, currentMonthCount));
    });
  });
  return daysMatrix;
}

export const useMonthCalendar = () => {
  const { monthIndex, setMonthIndex } = useMonthStore();
  const [currentMonth, setCurrentMonth] = useState(getMonth());

  const handlePrevMonth = useCallback(() => {
    setMonthIndex(monthIndex - 1);
  }, [monthIndex]);

  const handleForwardMonth = useCallback(() => {
    setMonthIndex(monthIndex + 1);
  }, [monthIndex]);

  const handleResetToday = useCallback(() => {
    setMonthIndex(dayjs().month());
  }, []);

  useEffect(() => {
    setCurrentMonth(getMonth(monthIndex));
  }, [monthIndex]);

  return {
    currentMonth,
    monthIndex,
    handleForwardMonth,
    handlePrevMonth,
    handleResetToday,
  };
};
