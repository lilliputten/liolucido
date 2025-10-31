import { AbstractIntlMessages } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';

import { debugLocale } from '@/config';

import { routing } from './routing';
import { defaultLocale } from './types';

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale)) {
    locale = defaultLocale;
  }

  // let messages: AbstractIntlMessages | undefined;

  const isDebugLocale = locale !== debugLocale;
  const localeFile = !isDebugLocale && `@/i18n/locales/${locale}.yaml`;
  console.log('XXX', {
    locale,
    isDebugLocale,
    localeFile,
  });
  debugger;

  /*
   * if (localeFile) {
   *   try {
   *     const fileContents = fs.readFileSync(localeFile, 'utf8');
   *     messages = parse(fileContents);
   *     console.log('[request:localeFile] Loaded messages', {
   *       messages,
   *       locale,
   *       isDebugLocale,
   *       localeFile,
   *     });
   *     debugger;
   *   } catch (error) {
   *     // eslint-disable-next-line no-console
   *     console.error('[request:localeFile]', {
   *       error,
   *       locale,
   *       isDebugLocale,
   *       localeFile,
   *     });
   *     debugger; // eslint-disable-line no-debugger
   *   }
   * }
   */

  const messages = isDebugLocale
    ? (await import(`@/i18n/locales/${locale}.yaml`)).default
    : undefined;

  /* // Load messages from json files
   * const messages = isDebugLocale ? (await import(`@/i18n/locales/${locale}.json`)).default : {};
   */

  return {
    locale,
    messages,
    // timeZone: 'UTC',
    /* defaultOnError: (error) => {
     *   console.log('[request:defaultOnError]', error);
     *   debugger;
     * },
     */
    /* NOTE: These handlers not invoke
     * // @see https://next-intl.dev/docs/usage/configuration#error-handling
     * onError(error) {
     *   const match = String(error).match(matchLocaleReg);
     *   const locale = match?.[1];
     *   console.log('[request:onError]', locale, error);
     *   debugger;
     *   if (error.code === IntlErrorCode.MISSING_MESSAGE && locale === debugLocale) {
     *     // Suppress missing message errors
     *     return;
     *   }
     *   // eslint-disable-next-line no-console
     *   console.error(error);
     *   debugger;
     * },
     * getMessageFallback({ key, error }) {
     *   debugger;
     *   if (error.code === IntlErrorCode.MISSING_MESSAGE) {
     *     return key; // fallback to key itself
     *   }
     *   return key;
     * },
     */
  };
});
