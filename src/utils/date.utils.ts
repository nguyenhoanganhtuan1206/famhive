import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

export function getLastsMinutes(time: Date) {
  return (Date.now() - time.getTime()) / 1000 / 60;
}

/**
 * Add minutes to date
 * @param {Date} date
 * @param {number} minutes
 * @returns {Date}
 */
export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60_000);
}

export function addHours(date: Date, hours: number): Date {
  return addMinutes(date, hours * 60);
}

export function startOfDay(date: Date): Date {
  return new Date(date.setHours(0, 0, 0));
}

export function endOfDay(date: Date): Date {
  return new Date(date.setHours(23, 59, 59));
}

export function getCurrentDateInUTC(): Date {
  const currentDate = new Date();

  return new Date(
    Date.UTC(
      currentDate.getUTCFullYear(),
      currentDate.getUTCMonth(),
      currentDate.getUTCDate(),
      currentDate.getUTCHours(),
      currentDate.getUTCMinutes(),
      currentDate.getUTCSeconds(),
      currentDate.getUTCMilliseconds(),
    ),
  );
}

export function isDateInRange(
  date: Date,
  fromDate: Date,
  toDate: Date,
): boolean {
  return dayjs(date).isBetween(fromDate, toDate);
}
