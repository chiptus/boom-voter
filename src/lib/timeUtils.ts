import { format, isValid, parseISO, isSameDay } from "date-fns";

export function formatTimeRange(startTime: string | null,
  endTime: string | null, use24Hour: boolean = false): string | null {
  if (!startTime && !endTime) return null;

  const start = startTime ? parseISO(startTime) : null;
  const end = endTime ? parseISO(endTime) : null;

  // Validate dates
  const validStart = start && isValid(start) ? start : null;
  const validEnd = end && isValid(end) ? end : null;

  if (!validStart && !validEnd) return null;

  const timeFormat = use24Hour ? "HH:mm" : "h:mm a";
  const dateTimeFormat = use24Hour ? "MMM d, HH:mm" : "MMM d, h:mm a";

  // Only start time
  if (validStart && !validEnd) {
    return `Starts: ${format(validStart, dateTimeFormat)}`;
  }

  // Only end time
  if (!validStart && validEnd) {
    return `Ends: ${format(validEnd, dateTimeFormat)}`;
  }

  // Both times
  if (validStart && validEnd) {
    if (isSameDay(validStart, validEnd)) {
      // Same day: "Dec 15, 2:00 PM - 4:00 PM" or "Dec 15, 14:00 - 16:00"
      return `${format(validStart, dateTimeFormat)} - ${format(
        validEnd,
        timeFormat
      )}`;
    } else {
      // Different days: "Dec 15, 2:00 PM - Dec 16, 1:00 AM" or "Dec 15, 14:00 - Dec 16, 01:00"
      return `${format(validStart, dateTimeFormat)} - ${format(
        validEnd,
        dateTimeFormat
      )}`;
    }
  }

  return null;
}

export const formatDateTime = (dateTime: string | null, use24Hour: boolean = false): string | null => {
  if (!dateTime) return null;

  const date = parseISO(dateTime);
  if (!isValid(date)) return null;

  const dateTimeFormat = use24Hour ? "MMM d, HH:mm" : "MMM d, h:mm a";
  return format(date, dateTimeFormat);
};

export const formatTimeOnly = (startTime: string | null, endTime: string | null, use24Hour: boolean = false): string | null => {
  if (!startTime) return null;

  const start = parseISO(startTime);
  const end = endTime ? parseISO(endTime) : null;

  if (!isValid(start)) return null;

  const timeFormat = use24Hour ? "HH:mm" : "h:mm a";

  if (end && isValid(end)) {
    return `${format(start, timeFormat)} - ${format(end, timeFormat)}`;
  }

  return format(start, timeFormat);
};
