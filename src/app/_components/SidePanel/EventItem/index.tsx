import { EVENT_TYPE } from '@/app/constants';
import { useEventStore, type Event } from '@/lib/stores/eventStore';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import { Avatar } from '@mui/material';
import { memo, useCallback } from 'react';
import { useModal } from '@/app/_hooks/useModal';
import { formatPeriodTime } from '@/lib/utils/formatTime';
import ClientDetailDrawer from '@/app/_components/common/ClientDetailDrawer';
import clsx from 'clsx';

type EventItemProps = {
  event: Event;
};

const EventItem = ({ event }: EventItemProps) => {
  console.log('🚀  [Debug] ~ EventItem ~ event:', event);
  const formattedPeriodTime = formatPeriodTime(event.startTime, event.endTime);
  const isAppointment = event.type === EVENT_TYPE.APPOINTMENT;
  const { setSelectedEvent, setShowEventModal } = useEventStore();
  const handleEditEvent = useCallback(
    (event: Event) => {
      if (!event) return;
      setSelectedEvent(event);
      setShowEventModal(true);
    },
    [setSelectedEvent, setShowEventModal]
  );

  const {
    isOpen: isOpenDrawer,
    closeModal: closeClientDrawer,
    openModal: openClientDrawer,
  } = useModal();
  return (
    <section
      className={clsx(
        'flex justify-between w-full p-3 rounded border-l-4',
        event.labelClass.bg,
        event.labelClass.border
      )}
    >
      <div className="flex flex-col justify-center text-xs gap-1 min-w-40">
        <p className={clsx('font-semibold text-wrap', event.labelClass.text)}>
          {event.title}
        </p>
        <p className="text-white font-thin">{formattedPeriodTime}</p>
        {isAppointment && (
          <div className="flex items-center gap-2 mt-2">
            <Avatar sx={{ width: '1.5rem', height: '1.5rem' }} />
            <button
              onClick={openClientDrawer}
              className="underline text-light-blue"
            >
              View Client Profile
            </button>
          </div>
        )}
      </div>

      {isAppointment && (
        <div>
          <VideocamOutlinedIcon
            className="text-light-blue rounded-full bg-white p-1"
            fontSize="large"
          />
        </div>
      )}

      {isAppointment && (
        <ClientDetailDrawer
          selectEventClient={event}
          handleEditEvent={handleEditEvent}
          isOpen={isOpenDrawer}
          closeDrawer={closeClientDrawer}
        />
      )}
    </section>
  );
};

export default memo(EventItem);
