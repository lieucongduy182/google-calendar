import { createStore } from '../createStore';

export enum EventType {
  Appointment = 'Appointment',
  Event = 'Event',
}

export type Event = {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD format
  startTime: string; // YYYY-MM-DD HH:mm format
  endTime: string; // YYYY-MM-DD HH:mm format
  selectedLabel: number;
  labelClass: {
    bg: string;
    border: string;
  };
  type: EventType;
  clientName?: string
  clientEmail?: string
};

type EventState = {
  events: Event[];
  selectedEvent: Event | null;
  showEventModal: boolean;
};

type EventActions = {
  createEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (updatedEvent: Event) => void;
  deleteEvent: (eventId: string) => void;

  setSelectedEvent: (event: Event | null) => void;

  setShowEventModal: (show: boolean) => void;
};

type EventStore = EventState & EventActions;

export const useEventStore = createStore<EventStore>(
  (set) => ({
    events: [],
    selectedEvent: null,
    createEvent: (eventData) => {
      const newEvent: Event = {
        ...eventData,
        id: generateId(),
      };

      set((state) => ({
        events: [...state.events, newEvent],
      }));

      return newEvent;
    },

    updateEvent: (updatedEvent) => {
      set((state) => ({
        events: state.events.map((event) =>
          event.id === updatedEvent.id ? updatedEvent : event
        ),
      }));
    },

    deleteEvent: (eventId) => {
      set((state) => ({
        events: state.events.filter((event) => event.id !== eventId),
        selectedEvent:
          state.selectedEvent?.id === eventId ? null : state.selectedEvent,
      }));
    },

    setSelectedEvent: (event) => {
      set({ selectedEvent: event });
    },

    showEventModal: false,
    setShowEventModal: (show) => set({ showEventModal: show }),
  }),
  'eventStore',
  true
);

function generateId(): string {
  return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}
