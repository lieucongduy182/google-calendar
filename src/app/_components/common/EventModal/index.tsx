'use client';

import React, { memo, useEffect, useMemo, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Button from '@mui/material/Button';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Modal from '@mui/material/Modal';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { Event, EventType, useEventStore } from '@/lib/stores/eventStore';
import { DATE_TIME_FORMAT, TIME_FORMAT, labelClasses } from '@/app/constants';

type AddEventModalProps = {
  isOpen: boolean;
  selectedDay: Dayjs | null;
  onClose: () => void;
};

function EventModal({ isOpen, selectedDay, onClose }: AddEventModalProps) {
  const selectedEvent = useEventStore((state) => state.selectedEvent);
  const createEvent = useEventStore((state) => state.createEvent);
  const updateEvent = useEventStore((state) => state.updateEvent);
  const selectedEventDayClone = useMemo(
    () => (selectedDay ? dayjs(selectedDay) : dayjs()),
    [selectedDay]
  );

  const initialFormData = useMemo(
    () => ({
      title: '',
      description: '',
      date: selectedEventDayClone,
      startTime: selectedEventDayClone,
      endTime: selectedEventDayClone.add(1, 'hour'),
      selectedLabel: 0,
      type: 'Event' as EventType,
      clientName: '',
      clientEmail: '',
    }),
    [selectedEventDayClone]
  );
  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = (e: React.SyntheticEvent) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (e: React.SyntheticEvent) => {
    const { value } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      type: value as EventType,
    }));
  };

  const handleDateChange = (newDate: Dayjs | null) => {
    if (!newDate) return;

    const newStartTime = formData.startTime
      .year(newDate.year())
      .month(newDate.month())
      .date(newDate.date());
    const newEndTime = formData.endTime
      .year(newDate.year())
      .month(newDate.month())
      .date(newDate.date());

    setFormData((prev) => ({
      ...prev,
      date: newDate,
      startTime: newStartTime,
      endTime: newEndTime,
    }));
  };

  const handleStartTimeChange = (newDateTime: Dayjs | null) => {
    if (!newDateTime) return;
    setFormData((prev) => {
      let newEndTime = prev.endTime;
      if (newDateTime.isAfter(prev.endTime)) {
        newEndTime = newDateTime.add(1, 'hour');
      }

      return {
        ...prev,
        startTime: newDateTime,
        endTime: newEndTime,
        date: newDateTime,
      };
    });
  };

  const handleEndTimeChange = (newDateTime: Dayjs | null) => {
    if (!newDateTime) return;
    setFormData((prev) => ({
      ...prev,
      endTime: newDateTime,
    }));
  };

  const handleColorSelect = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      selectedLabel: index,
    }));
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    const formattedEventData: Omit<Event, 'id'> = {
      title: formData.title,
      description: formData.description,
      date: formData.date.format(DATE_TIME_FORMAT),
      startTime: formData.startTime.format(TIME_FORMAT),
      endTime: formData.endTime.format(TIME_FORMAT),
      labelClass: {
        bg: labelClasses[formData.selectedLabel].bg,
        border: labelClasses[formData.selectedLabel].border,
      },
      selectedLabel: formData.selectedLabel,
      type: formData.type,
      clientName: formData.clientName,
      clientEmail: formData.clientEmail,
    };

    if (selectedEvent) {
      updateEvent({
        ...formattedEventData,
        id: selectedEvent.id,
      });
    } else {
      createEvent(formattedEventData);
    }

    onClose();
  };

  useEffect(() => {
    if (selectedEvent) {
      setFormData({
        title: selectedEvent.title,
        description: selectedEvent.description,
        date: dayjs(selectedEvent.date),
        startTime: dayjs(selectedEvent.startTime),
        endTime: dayjs(selectedEvent.endTime),
        selectedLabel: selectedEvent.selectedLabel,
        type: selectedEvent.type,
        clientName: selectedEvent.clientName || '',
        clientEmail: selectedEvent.clientEmail || '',
      });
    } else {
      setFormData(initialFormData);
    }
  }, [selectedEvent, initialFormData]);

  if (!isOpen) return null;

  return (
    <Modal open={isOpen} onClose={onClose} className="w-500">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-medium">
                {selectedEvent ? 'Edit Event' : 'Add Event'}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <CloseOutlinedIcon fontSize="small" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4">
              <div className="space-y-4">
                <div>
                  <TextField
                    fullWidth
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Add title"
                    variant="standard"
                    required
                    inputProps={{
                      style: { fontSize: '1rem' },
                    }}
                  />
                </div>

                <div className="mb-4">
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Type</InputLabel>
                    <Select
                      value={formData.type}
                      name="type"
                      onChange={handleTypeChange}
                      label="Type"
                    >
                      <MenuItem value="Event">Event</MenuItem>
                      <MenuItem value="Appointment">Appointment</MenuItem>
                    </Select>
                  </FormControl>
                </div>

                {formData.type === 'Appointment' && (
                  <div className="space-y-4">
                    <TextField
                      fullWidth
                      name="clientName"
                      value={formData.clientName}
                      onChange={handleInputChange}
                      label="Client Name"
                      placeholder="Enter client name"
                      variant="outlined"
                      required
                    />
                    <TextField
                      fullWidth
                      name="clientEmail"
                      value={formData.clientEmail}
                      onChange={handleInputChange}
                      label="Client Email"
                      placeholder="Enter client email"
                      variant="outlined"
                      type="email"
                      required
                    />
                  </div>
                )}

                <div className="mb-4">
                  <DatePicker
                    label="Date"
                    value={formData.date}
                    onChange={handleDateChange}
                    slotProps={{ textField: { fullWidth: true } }}
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TimePicker
                    label="Start time"
                    value={formData.startTime}
                    onChange={handleStartTimeChange}
                    slotProps={{ textField: { fullWidth: true } }}
                    className="w-full"
                    views={['hours', 'minutes']}
                  />

                  <TimePicker
                    label="End time"
                    value={formData.endTime}
                    onChange={handleEndTimeChange}
                    slotProps={{ textField: { fullWidth: true } }}
                    className="w-full"
                    minTime={formData.startTime}
                    views={['hours', 'minutes']}
                  />
                </div>

                <div className="mt-4">
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    label="Description"
                    placeholder="Add description"
                    variant="outlined"
                  />
                </div>

                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Event color
                  </p>
                  <div className="flex gap-2">
                    {labelClasses.map((label, index) => (
                      <div
                        key={index}
                        onClick={() => handleColorSelect(index)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer ${label.bg}`}
                      >
                        {index === formData.selectedLabel && (
                          <CheckOutlinedIcon
                            className="text-white"
                            fontSize="small"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6 space-x-2">
                <Button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {selectedEvent ? 'Update' : 'Save'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </LocalizationProvider>
    </Modal>
  );
}

export default memo(EventModal);
