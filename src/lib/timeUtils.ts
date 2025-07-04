import { format, isValid, parseISO, isSameDay } from 'date-fns';

export const formatTimeRange = (startTime: string | null, endTime: string | null): string | null => {
  if (!startTime && !endTime) return null;

  const start = startTime ? parseISO(startTime) : null;
  const end = endTime ? parseISO(endTime) : null;

  // Validate dates
  const validStart = start && isValid(start) ? start : null;
  const validEnd = end && isValid(end) ? end : null;

  if (!validStart && !validEnd) return null;

  // Only start time
  if (validStart && !validEnd) {
    return `Starts: ${format(validStart, 'MMM d, h:mm a')}`;
  }

  // Only end time
  if (!validStart && validEnd) {
    return `Ends: ${format(validEnd, 'MMM d, h:mm a')}`;
  }

  // Both times
  if (validStart && validEnd) {
    if (isSameDay(validStart, validEnd)) {
      // Same day: "Dec 15, 2:00 PM - 4:00 PM"
      return `${format(validStart, 'MMM d, h:mm a')} - ${format(validEnd, 'h:mm a')}`;
    } else {
      // Different days: "Dec 15, 2:00 PM - Dec 16, 1:00 AM"
      return `${format(validStart, 'MMM d, h:mm a')} - ${format(validEnd, 'MMM d, h:mm a')}`;
    }
  }

  return null;
};

export const formatDateTime = (dateTime: string | null): string | null => {
  if (!dateTime) return null;
  
  const date = parseISO(dateTime);
  if (!isValid(date)) return null;
  
  return format(date, 'MMM d, h:mm a');
};