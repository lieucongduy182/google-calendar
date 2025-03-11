'use client';

import { Fragment, useCallback } from 'react';
import CalendarHeader from '@/app/month-view/CalendarHeader';
import DayButtonLarge from '@/app/month-view/DayButtonLarge';
import { useMonthCalendar } from '@/app/_hooks/useMonthCalendar';
import { useSelectedDayStore } from '@/lib/stores/selectedDayStore';
import { Dayjs } from 'dayjs';
import { useEventModal } from '@/app/_hooks/useEventModal';
import EventModal from '@/app/_components/common/EventModal';
import dayjs from 'dayjs';
import { DAYS_OF_WEEK, DAYS_OF_WEEK_FORMAT } from '@/app/constants';

function MonthView() {
  const daysOfWeek = Array.from({ length: DAYS_OF_WEEK }, (_, i) =>
    dayjs().day(i).format(DAYS_OF_WEEK_FORMAT).toUpperCase()
  );
  const {
    currentMonth,
    monthIndex,
    handleForwardMonth,
    handlePrevMonth,
    handleResetToday,
  } = useMonthCalendar();
  const { selectedDay, setSelectedDay } = useSelectedDayStore();

  const { events, showEventModal, openNewEventModal, setShowEventModal } =
    useEventModal();

  const handleSelectedDay = useCallback((day: Dayjs) => {
    setSelectedDay(day);
    openNewEventModal();
  }, [setSelectedDay, openNewEventModal]);

  return (
    <section className={'p-5 w-full bg-white rounded-xl block'}>
      <CalendarHeader
        currentMonthIndex={monthIndex}
        handleForwardMonth={handleForwardMonth}
        handlePrevMonth={handlePrevMonth}
        handleResetToday={handleResetToday}
      />
      <div className="grid grid-cols-7">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="text-md text-center font-bold text-gray-400 mb-2"
          >
            {day}
          </div>
        ))}
        {currentMonth?.map((week, _monthIndex) => (
          <Fragment key={`week-${_monthIndex}`}>
            {week.map((date, _weekIndex) => (
              <DayButtonLarge
                key={`day-${_weekIndex}`}
                date={date}
                events={events}
                currentMonthIndex={monthIndex}
                handleSelectedDay={handleSelectedDay}
              />
            ))}
          </Fragment>
        ))}
      </div>

      <EventModal
        isOpen={showEventModal}
        selectedDay={selectedDay}
        onClose={() => setShowEventModal(false)}
      />
    </section>
  );
}

export default MonthView;
