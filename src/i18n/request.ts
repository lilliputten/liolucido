import { getRequestConfig } from 'next-intl/server';

import { routing } from './routing';
import { TLocale } from './types';

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as TLocale)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`@/i18n/locales/${locale}.json`)).default,
  };
});
