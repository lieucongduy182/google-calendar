import { memo } from 'react';
import ButtonForwardMonth from '@/app/_components/common/ButtonForwardMonth';
import ButtonPrevMonth from '@/app/_components/common/ButtonPrevMonth';
import MonthYearText from '@/app/_components/common/MonthYearText';
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';
import Link from 'next/link';

type CalendarHeaderProps = {
  currentMonthIndex: number;
  handlePrevMonth: () => void;
  handleForwardMonth: () => void;
  handleResetToday: () => void;
};

function CalendarHeader({
  currentMonthIndex,
  handlePrevMonth,
  handleForwardMonth,
  handleResetToday,
}: CalendarHeaderProps) {
  return (
    <header className="mb-6">
      <div className="hidden md:flex">
        <button
          className="border border-dark-blue px-3 py-2 rounded-lg flex items-center justify-center"
          onClick={handleResetToday}
        >
          Today
        </button>
        <div className="flex justify-center items-center">
          <ButtonPrevMonth onClick={handlePrevMonth} />
          <ButtonForwardMonth onClick={handleForwardMonth} />
          <MonthYearText currentMonthIndex={currentMonthIndex} />
        </div>
      </div>

      <div className="md:hidden flex items-center gap-2">
        <Link className="block md:hidden" href="/">
          <ArrowBackIosOutlinedIcon fontSize="small" />
        </Link>
        <MonthYearText currentMonthIndex={currentMonthIndex} />
      </div>
    </header>
  );
}

export default memo(CalendarHeader);
