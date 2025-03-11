import dayjs from 'dayjs';
import { createStore } from '../createStore';

type MonthState = {
  monthIndex: number;
};

type MonthActions = {
  setMonthIndex: (index: number) => void;
  getMonthIndex: () => number;
};

type MonthStore = MonthState & MonthActions;

export const useMonthStore = createStore<MonthStore>(
  (set, get) => ({
    monthIndex: dayjs().month(),
    setMonthIndex: (monthIndex) => set({ monthIndex }),
    getMonthIndex: () => get().monthIndex,
  }),
  'monthStore'
);
