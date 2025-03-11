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
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import {
  Event,
  EventType,
  RecurringType,
  useEventStore,
} from '@/lib/stores/eventStore';
import {
  DATE_TIME_FORMAT,
  RECURRING_TYPE,
  RECURRING_VALUE,
  TIME_FORMAT,
  labelClasses,
} from '@/app/constants';

type AddEventModalProps = {
  isOpen: boolean;
  selectedDay: Dayjs | null;
  onClose: () => void;
};

function EventModal({ isOpen, selectedDay, onClose }: AddEventModalProps) {
  const selectedEvent = useEventStore((state) => state.selectedEvent);
  const createEvent = useEventStore((state) => state.createEvent);
  const createEvents = useEventStore((state) => state.createEvents);
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
      recurringType: RECURRING_TYPE.SINGLE as RecurringType,
      recurringValue: '',
      recurringGroupId: '',
      recurringTimes: 0,
    }),
    [selectedEventDayClone]
  );
  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = (e: React.SyntheticEvent) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (e: SelectChangeEvent) => {
    const { value, name } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value as EventType,
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
      recurringType: formData.recurringType as RecurringType,
      recurringValue: formData.recurringValue,
      recurringGroupId: formData.recurringGroupId,
      recurringTimes: formData.recurringTimes,
    };

    if (selectedEvent) {
      updateEvent({
        ...formattedEventData,
        id: selectedEvent.id,
      });
    } else {
      if (formData.recurringType === RECURRING_TYPE.SINGLE) {
        createEvent(formattedEventData);
      } else if (formData.recurringType === RECURRING_TYPE.RECURRING) {
        const firstEvent = {
          ...formattedEventData,
          date: formData.date.format(DATE_TIME_FORMAT),
        };
        switch (formData.recurringValue) {
          case RECURRING_VALUE.DAILY: {
            const { id } = createEvent(firstEvent);
            const events = [];
            for (let i = 1; i < formData.recurringTimes; i++) {
              const newDate = formData.date.add(i, 'day');
              events.push({
                ...formattedEventData,
                date: newDate.format(DATE_TIME_FORMAT),
                recurringGroupId: id,
              });
            }
            createEvents(events);
            break;
          }
          case RECURRING_VALUE.WEEKLY: {
            const { id } = createEvent(firstEvent);
            const weekEvents = [];
            for (let i = 1; i < formData.recurringTimes; i++) {
              const newDate = formData.date.add(i, 'week');
              weekEvents.push({
                ...formattedEventData,
                date: newDate.format(DATE_TIME_FORMAT),
                recurringGroupId: id,
              });
            }
            createEvents(weekEvents);
            break;
          }
          case RECURRING_VALUE.MONTHLY: {
            const { id } = createEvent(firstEvent);
            const monthEvents = [];
            for (let i = 1; i < formData.recurringTimes; i++) {
              const newDate = formData.date.add(i, 'month');
              monthEvents.push({
                ...formattedEventData,
                date: newDate.format(DATE_TIME_FORMAT),
                recurringGroupId: id,
              });
            }
            createEvents(monthEvents);
            break;
          }
        }
      }
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
        recurringType: selectedEvent.recurringType,
        recurringValue: selectedEvent.recurringValue || '',
        recurringGroupId: selectedEvent.recurringGroupId || '',
        recurringTimes: selectedEvent.recurringTimes,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [selectedEvent, initialFormData]);

  if (!isOpen) return null;

  const isSelectRecurringEvent = formData.recurringType === 'recurring';
  const isEditingEvent = !!selectedEvent;

  return (
    <Modal open={isOpen} onClose={onClose} className="w-full">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md  overflow-auto max-h-screen h-fit">
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
                      readOnly={isEditingEvent}
                    >
                      <MenuItem value="Event">Event</MenuItem>
                      <MenuItem value="Appointment">Appointment</MenuItem>
                    </Select>
                  </FormControl>
                </div>

                <div className="mb-4">
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Recurring Type</InputLabel>
                    <Select
                      value={formData.recurringType}
                      name="recurringType"
                      onChange={handleTypeChange}
                      label="Type"
                      readOnly={isEditingEvent}
                    >
                      <MenuItem value="single">Normal event</MenuItem>
                      <MenuItem value="recurring">Recurring</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                {isSelectRecurringEvent && (
                  <>
                    <div className="mb-4">
                      <FormControl fullWidth variant="outlined">
                        <InputLabel>Repeat Type</InputLabel>
                        <Select
                          value={formData.recurringValue || ''}
                          name="recurringValue"
                          onChange={handleTypeChange}
                          label="Type"
                          readOnly={isEditingEvent}
                        >
                          <MenuItem value="daily">daily</MenuItem>
                          <MenuItem value="weekly">weekly</MenuItem>
                          <MenuItem value="monthly">monthly</MenuItem>
                        </Select>
                      </FormControl>
                    </div>

                    <div className="p-2 flex gap-2 items-center">
                      <InputLabel>Repeat Times</InputLabel>
                      <input
                        className="p-2 border border-gray-400 rounded w-200"
                        type="number"
                        name="recurringTimes"
                        value={formData.recurringTimes}
                        onChange={handleInputChange}
                        placeholder="Repeat time"
                        min={1}
                        required={formData.recurringTimes > 1}
                        readOnly={isEditingEvent}
                      />
                    </div>
                  </>
                )}
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
                  variant="outlined"
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none"
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md hover:bg-blue-700 focus:outline-none"
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
