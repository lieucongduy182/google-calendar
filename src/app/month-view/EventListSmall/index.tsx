import { useEventModal } from '@/app/_hooks/useEventModal';
import { Event } from '@/lib/stores/eventStore';
import clsx from 'clsx';
import { memo } from 'react';

type EventListSmallProps = {
  event: Event;
};

function EventListSmall({ event }: EventListSmallProps) {
  const { openEditEventModal } = useEventModal();
  return (
    <div
      className={clsx(
        'w-full text-xs text-ellipsis whitespace-nowrap overflow-hidden text-calendar-color p-1 rounded mb-0.5 font-semibold border-l-4 cursor-pointer hover:opacity-80',
        event.labelClass.bg,
        event.labelClass.border
      )}
      onClick={(e) => {
        e.stopPropagation();
        openEditEventModal(event);
      }}
    >
      {event.title}
    </div>
  );
}

export default memo(EventListSmall);
