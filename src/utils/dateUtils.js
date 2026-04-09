import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";

export function getCalendarDays(viewingMonth) {
  // Get the very first day of the month and the very last day
  const monthStart = startOfMonth(viewingMonth);
  const monthEnd = endOfMonth(viewingMonth);

  // Pad the beginning and end to fill the grid completely (starting on Monday)
  // The reference image starts the week on Monday (MON TUE WED...)
  const startDate = startOfWeek(monthStart, { weekStarts: 1 });
  const endDate = endOfWeek(monthEnd, { weekStarts: 1 });

  // Return an array of every single day in that interval
  return eachDayOfInterval({
    start: startDate,
    end: endDate,
  });
}