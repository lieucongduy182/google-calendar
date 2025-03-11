import React, { memo, useCallback } from 'react';
import { Dayjs } from 'dayjs';
import { useSelectedDayStore } from '@/lib/stores/selectedDayStore';
import DayButton from './DayButton';
import SmallCalendarHeader from './SmallCalendarHeader';

type SmallCalendarProps = {
  currentMonth: Dayjs[][];
  currentMonthIndex: number;
  daysOfWeek: string[];
  handleForwardMonth: () => void;
  handlePrevMonth: () => void;
};

function SmallCalendar({
  currentMonth,
  currentMonthIndex,
  daysOfWeek,
  handleForwardMonth,
  handlePrevMonth,
}: SmallCalendarProps) {
  const { selectedDay, setSelectedDay } = useSelectedDayStore();
  const handleSelectedDay = useCallback(
    (day: Dayjs) => {
      setSelectedDay(day);
    },
    [setSelectedDay]
  );

  return (
    <section className="p-5">
      <header className="flex justify-between flex-col">
        <SmallCalendarHeader
          currentMonthIndex={currentMonthIndex}
          handlePrevMonth={handlePrevMonth}
          handleForwardMonth={handleForwardMonth}
        />
        <div className="grid grid-cols-7 grid-rows-6 gap-2">
          {daysOfWeek.map((day, index) => (
            <div
              key={`${day}-${index}`}
              className="text-xs text-center font-bold text-gray-400"
            >
              {day}
            </div>
          ))}
          {currentMonth?.map((week, _monthIndex) => (
            <React.Fragment key={`week-${_monthIndex}`}>
              {week.map((date, _weekIndex) => (
                <div key={`day-${_weekIndex}`} className="flex justify-center">
                  <DayButton
                    date={date}
                    currentMonthIndex={currentMonthIndex}
                    selectedDay={selectedDay}
                    handleSelectedDay={handleSelectedDay}
                  />
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </header>
    </section>
  );
}

export default memo(SmallCalendar);
