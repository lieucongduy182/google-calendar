import dayjs from 'dayjs';
import isLeapYear from 'dayjs/plugin/isLeapYear';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import SidePanel from '@/app/_components/SidePanel';
import MonthView from '@/app/month-view/page';

dayjs.extend(isLeapYear);
dayjs.extend(isSameOrAfter);
dayjs.locale('vi');

export default function Home() {
  return (
    <section className="min-h-screen w-full p-4 sm:p-10">
      <div className="md:flex md:flex-row md:gap-4">
        <SidePanel />
        <div className="hidden md:block">
          <MonthView />
        </div>
      </div>
    </section>
  );
}
