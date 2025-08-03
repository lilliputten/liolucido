import { useFormatter } from 'next-intl';

const hourDateLimit = 1000 * 60 * 60;
const dayDateLimit = hourDateLimit * 24;
const relativeDateLimit = dayDateLimit;
// const halfMonthLimit = dayDateLimit * 15;
const halfYearLimit = dayDateLimit * 30 * 6;

/** Return numeric date epochs difference. The returned value is positive if 'b' is the later than 'a'. Returns zero if the dates are equal. */
export function compareDates(a: Date, b: Date) {
  return b.getTime() - a.getTime();
}

export function getFormattedRelativeDate(
  format: ReturnType<typeof useFormatter>,
  date: Date = new Date(),
  now: Date = new Date(),
) {
  const diff = now.getTime() - date.getTime();
  if (diff < relativeDateLimit) {
    // Return relative date
    return format.relativeTime(date, now);
  }
  // Return full date
  return format.dateTime(date, {
    // Show a year only if half a year passed
    year: diff >= halfYearLimit ? 'numeric' : undefined,
    month: 'short',
    day: 'numeric',
  });
}

export function useFormattedRelativeDate(date?: Date, now?: Date) {
  const format = useFormatter();
  return getFormattedRelativeDate(format, date, now);
}
