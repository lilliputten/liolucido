import { useFormatter } from 'next-intl';

const hourDateLimit = 1000 * 60 * 60;
const dayDateLimit = hourDateLimit * 24;
const relativeDateLimit = dayDateLimit;
// const halfMonthLimit = dayDateLimit * 15;
const halfYearLimit = dayDateLimit * 30 * 6;

export function useFormattedRelativeDate(date: Date = new Date(), now: Date = new Date()) {
  const format = useFormatter();
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
