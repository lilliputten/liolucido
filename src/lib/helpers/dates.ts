import ms from 'ms';
import { useFormatter, useTranslations } from 'next-intl';

import { defaultLocale, TLocale } from '@/i18n/types';

/* // TODO: Translations:
 *
 * See translation approach in ``formatSecondsDuration`.
 *
 * You'll need to add these keys to your messages file (to be able to use `useTranslations('duration')`):
 *
 * ```
 * {
 *   "duration": {
 *     "days": "d",
 *     "hours": "h",
 *     "minutes": "m",
 *     "seconds": "s"
 *   }
 * }
 * ```
 */

type TIntlTranslator = (key: string) => string;

const minDateLimit = 1000 * 60;
const hourDateLimit = minDateLimit * 60;
const dayDateLimit = hourDateLimit * 24;
const relativeDateLimit = dayDateLimit;
// const halfMonthLimit = dayDateLimit * 15;
const halfYearLimit = dayDateLimit * 30 * 6;

/** Workaround for cases when date has been passed as an ISO string or en empty value (now) */
export function ensureDate(date?: Date | string): Date {
  if (!date) {
    return new Date();
  }
  if (typeof date === 'string') {
    return new Date(date);
  }
  return date;
}

/** Return numeric date epochs difference. The returned value is positive if 'b' is the later than 'a'. Returns zero if the dates are equal. */
export function compareDates(a: Date | string, b: Date | string) {
  // Workaround for cases when date has been passed as an ISO string
  a = ensureDate(a);
  b = ensureDate(b);

  return b.getTime() - a.getTime();
}

export function getFormattedRelativeDate(
  format: ReturnType<typeof useFormatter>,
  date?: Date | string,
  now?: Date | string,
) {
  // Workaround for cases when date has been passed as an ISO string
  date = ensureDate(date);
  now = ensureDate(now);

  /*
   * // DEBUG
   * console.log('[dates:getFormattedRelativeDate]', {
   *   format,
   *   date,
   *   now,
   * });
   * if (typeof date.getTime !== 'function') {
   *   debugger;
   * }
   */
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

export function useFormattedRelativeDate(date?: Date | string, now?: Date | string) {
  // Workaround for cases when date has been passed as an ISO string
  date = ensureDate(date);
  now = ensureDate(now);

  const format = useFormatter();
  return getFormattedRelativeDate(format, date, now);
}

export function getNativeFormattedRelativeDate(
  date: Date | string = new Date(),
  now: Date | string = new Date(),
  locale: TLocale = defaultLocale,
) {
  // Workaround for cases when date has been passed as an ISO string
  date = ensureDate(date);
  now = ensureDate(now);

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
export const timeAgo = (timestamp: Date | string, timeOnly?: boolean): string => {
  // Workaround for cases when date has been passed as an ISO string
  timestamp = ensureDate(timestamp);

  if (!timestamp) {
    return 'never';
  }
  return `${ms(Date.now() - new Date(timestamp).getTime())}${timeOnly ? '' : ' ago'}`;
};

export function formatSecondsDuration(seconds: number = 0, t?: TIntlTranslator): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}${t?.('duration.days') || 'd'}`);
  if (hours > 0) parts.push(`${hours}${t?.('duration.hours') || 'h'}`);
  if (minutes > 0) parts.push(`${minutes}${t?.('duration.minutes') || 'm'}`);
  if (remainingSeconds > 0 || parts.length === 0)
    parts.push(`${remainingSeconds}${t?.('duration.seconds') || 's'}`);

  return parts.join(' ');
}

export function useFormattedDuration(seconds: number) {
  const t = useTranslations('duration');
  return formatSecondsDuration(seconds, (key) => t(key.split('.')[1]));
}
