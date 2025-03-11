import { Event } from '@/lib/stores/eventStore';
import { Button, Drawer } from '@mui/material';
import { memo } from 'react';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { formatPeriodTime } from '@/lib/utils/formatTime';

type Props = {
  selectEventClient: Event;
  isOpen: boolean;
  closeDrawer: () => void;
  handleEditEvent: (event: Event) => void;
};

const ClientDetailDrawer = ({
  selectEventClient,
  isOpen,
  closeDrawer,
  handleEditEvent,
}: Props) => {
  return (
    <Drawer anchor="right" open={isOpen} onClose={closeDrawer}>
      <div className="w-80 sm:w-96 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Client Information</h3>
          <Button
            onClick={closeDrawer}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <CloseOutlinedIcon fontSize="small" />
          </Button>
        </div>

        {selectEventClient && (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h4 className="text-lg font-medium mb-2">
                {selectEventClient.clientName}
              </h4>
              {selectEventClient.clientEmail && (
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Email:</strong> {selectEventClient.clientEmail}
                </p>
              )}
              <div className="mt-4 pt-4 border-t border-blue-100">
                <p className="text-sm font-medium">Appointment</p>
                <p className="text-sm">{selectEventClient.title}</p>
                <p className="text-xs text-gray-500">
                  {selectEventClient.date}
                </p>
                <p className="text-xs text-gray-500">
                  {formatPeriodTime(
                    selectEventClient.startTime,
                    selectEventClient.endTime
                  )}
                </p>
              </div>
            </div>

            <div className="pt-4">
              <Button
                onClick={() => {
                  handleEditEvent(selectEventClient);
                  closeDrawer();
                }}
                variant="contained"
                color="primary"
                fullWidth
              >
                Edit Appointment
              </Button>
              <Button
                className="mt-2"
                onClick={() => {
                  if (selectEventClient.clientEmail) {
                    window.location.href = `mailto:${selectEventClient.clientEmail}?subject=Regarding your appointment: ${selectEventClient.title}`;
                  }
                }}
                variant="outlined"
                fullWidth
                disabled={!selectEventClient.clientEmail}
              >
                Contact Client
              </Button>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default memo(ClientDetailDrawer);
