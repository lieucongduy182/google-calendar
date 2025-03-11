import dayjs from 'dayjs';

const MONTH_YEAR_FORMAT = 'MMMM YYYY';

const MonthYearText = ({
  currentMonthIndex,
}: {
  currentMonthIndex: number;
}) => (
  <p className="text-dark-blue font-bold text-lg text-center">
    {dayjs(new Date(dayjs().year(), currentMonthIndex)).format(
      MONTH_YEAR_FORMAT
    )}
  </p>
);

export default MonthYearText;
