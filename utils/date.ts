import moment from "moment";

/**
 * Format a date to show how long ago it was (e.g., "2 hours ago", "3 days ago")
 * @param date - The date to format
 * @returns Formatted string showing time from now
 */
export const fromNow = (date: Date | string | number): string => {
  return moment(date).fromNow();
};

/**
 * Format a date to a specific format
 * @param date - The date to format
 * @param format - The format string (default: 'YYYY-MM-DD')
 * @returns Formatted date string
 */
export const formatDate = (
  date: Date | string | number,
  format: string = "YYYY-MM-DD"
): string => {
  return moment(date).format(format);
};

/**
 * Format a date and time
 * @param date - The date to format
 * @param format - The format string (default: 'YYYY-MM-DD HH:mm:ss')
 * @returns Formatted date and time string
 */
export const formatDateTime = (
  date: Date | string | number,
  format: string = "YYYY-MM-DD HH:mm:ss"
): string => {
  return moment(date).format(format);
};

/**
 * Format a date to show only the time
 * @param date - The date to format
 * @param format - The format string (default: 'HH:mm')
 * @returns Formatted time string
 */
export const formatTime = (
  date: Date | string | number,
  format: string = "HH:mm"
): string => {
  return moment(date).format(format);
};

/**
 * Format a date to show the day of the week
 * @param date - The date to format
 * @returns Day of the week (e.g., "Monday", "Tuesday")
 */
export const formatDayOfWeek = (date: Date | string | number): string => {
  return moment(date).format("dddd");
};

/**
 * Check if a date is today
 * @param date - The date to check
 * @returns boolean indicating if the date is today
 */
export const isToday = (date: Date | string | number): boolean => {
  return moment(date).isSame(moment(), "day");
};

/**
 * Get the start of a day
 * @param date - The date to get the start of
 * @returns Date object representing the start of the day
 */
export const startOfDay = (date: Date | string | number): Date => {
  return moment(date).startOf("day").toDate();
};

/**
 * Get the end of a day
 * @param date - The date to get the end of
 * @returns Date object representing the end of the day
 */
export const endOfDay = (date: Date | string | number): Date => {
  return moment(date).endOf("day").toDate();
};

/**
 * Get the greeting based on the current time
 * @returns Greeting string (e.g., "Good morning", "Good afternoon", "Good evening")
 */
export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};
