import dayjs, { Dayjs } from 'dayjs';
import { createStore } from '../createStore';

type SelectedDayState = {
  selectedDay: Dayjs | null;
};

type SelectedDayActions = {
  setSelectedDay: (day: Dayjs) => void;
};

type SelectedDayStore = SelectedDayState & SelectedDayActions;

export const useSelectedDayStore = createStore<SelectedDayStore>(
  (set) => ({
    selectedDay: dayjs(),
    setSelectedDay: (selectedDay) => set({ selectedDay }),
  }),
  'selectedDayStore',
  false
);
