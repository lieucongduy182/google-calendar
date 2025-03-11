'use client';

import { Event, useEventStore } from '@/lib/stores/eventStore';

export function useEventModal() {
  const events = useEventStore((state) => state.events);
  const showEventModal = useEventStore((state) => state.showEventModal);
  const setSelectedEvent = useEventStore((state) => state.setSelectedEvent);
  const setShowEventModal = useEventStore((state) => state.setShowEventModal);

  const openNewEventModal = () => {
    setSelectedEvent(null);
    setShowEventModal(true);
  };

  const openEditEventModal = (event: Event | null) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  return {
    events,
    showEventModal,
    setShowEventModal,
    openNewEventModal,
    openEditEventModal,
  };
}
