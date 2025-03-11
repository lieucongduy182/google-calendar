import { memo } from 'react';
import ButtonForwardMonth from '@/app/_components/common/ButtonForwardMonth';
import ButtonPrevMonth from '@/app/_components/common/ButtonPrevMonth';
import MonthYearText from '@/app/_components/common/MonthYearText';

type SmallCalendarHeaderProps = {
  currentMonthIndex: number;
  handlePrevMonth: () => void;
  handleForwardMonth: () => void;
};

function SmallCalendarHeader({
  currentMonthIndex,
  handlePrevMonth,
  handleForwardMonth,
}: SmallCalendarHeaderProps) {
  return (
    <header className="flex justify-between mb-6">
      <ButtonPrevMonth onClick={handlePrevMonth} />
      <MonthYearText currentMonthIndex={currentMonthIndex} />
      <ButtonForwardMonth onClick={handleForwardMonth} />
    </header>
  );
}

export default memo(SmallCalendarHeader);
