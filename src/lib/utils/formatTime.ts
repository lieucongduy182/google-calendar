import { PERIOD_TIME_FORMAT } from '@/app/constants';
import dayjs from 'dayjs';

export const formatPeriodTime = (startTime: string, endTime: string) => {
  return `${dayjs(startTime).format(PERIOD_TIME_FORMAT)} - ${dayjs(
    endTime
  ).format(PERIOD_TIME_FORMAT)} GMT${dayjs().format('Z')}`;
};
