import ms from 'ms';
import { useFormatter } from 'next-intl';

import { defaultLocale, TLocale } from '@/i18n/types';

const minDateLimit = 1000 * 60;
const hourDateLimit = minDateLimit * 60;
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

export function getNativeFormattedRelativeDate(
  date: Date = new Date(),
  now: Date = new Date(),
  locale: TLocale = defaultLocale,
) {
  const rtf = new Intl.RelativeTimeFormat(locale, { style: 'short' });
  const diff = now.getTime() - date.getTime();
  const absDiff = Math.abs(diff);

  // Handle past dates (positive diff means past - now is later than date)
  if (diff >= 0 && absDiff < relativeDateLimit) {
    // Past date within a day
    if (absDiff < 1000 * 60) {
      // Less than 1 minute ago
      return rtf.format(-Math.round(absDiff / 1000), 'seconds');
    } else if (absDiff < hourDateLimit) {
      // Less than 1 hour ago
      return rtf.format(-Math.round(absDiff / minDateLimit), 'minutes');
    } else {
      // Less than 1 day ago
      return rtf.format(-Math.round(absDiff / hourDateLimit), 'hours');
    }
  }

  // Handle future dates (negative diff means future - now is earlier than date)
  if (diff < 0 && absDiff < relativeDateLimit) {
    // Future date within a day
    if (absDiff < 1000 * 60) {
      // Less than 1 minute in future
      return rtf.format(Math.round(absDiff / 1000), 'seconds');
    } else if (absDiff < hourDateLimit) {
      // Less than 1 hour in future
      return rtf.format(Math.round(absDiff / minDateLimit), 'minutes');
    } else {
      // Less than 1 day in future
      return rtf.format(Math.round(absDiff / hourDateLimit), 'hours');
    }
  }

  // Return full date for dates older than a day (both past and future)
  const formatter = new Intl.DateTimeFormat(locale, {
    year: absDiff >= halfYearLimit ? 'numeric' : undefined,
    month: 'short',
    day: 'numeric',
  });
  return formatter.format(date);
}

export function formatDate(input: string | number, locale: TLocale = defaultLocale): string {
  const date = new Date(input);
  return date.toLocaleDateString(locale, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

// Utils from precedent.dev
export const timeAgo = (timestamp: Date, timeOnly?: boolean): string => {
  if (!timestamp) {
    return 'never';
  }
  return `${ms(Date.now() - new Date(timestamp).getTime())}${timeOnly ? '' : ' ago'}`;
};
