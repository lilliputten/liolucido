'use server';

import { getLocale, getTranslations as nextIntlGetTranslations } from 'next-intl/server';

import { debugLocale, debugTranslations } from '@/config';

import { getDebugT } from './getDebugT';

export async function getT(opts?: { locale?: string; namespace?: string }) {
  const locale = await getLocale();
  const isDebugLocale = debugTranslations || (debugLocale && locale === debugLocale);
  if (isDebugLocale) {
    // const t0 = function t(key: string, _values?: TranslationValues, _formats?: Formats): string {
    //   return [opts?.namespace, key].filter(Boolean).join('.');
    // };
    // const t = Object.assign(t0, {
    //   rich: (key: string, _values?: RichTranslationValues, _formats?: Formats) => {
    //     return [opts?.namespace, key].filter(Boolean).join('.');
    //   },
    // });
    return getDebugT(opts?.namespace);
  }

  const originalT = await nextIntlGetTranslations(opts);
  return originalT;

  // // Wrapped translation function
  // return function t(key: string, values?: TranslationValues, formats?: Formats): string {
  //   if (isDebugLocale) {
  //     // Show translation key in dev mode
  //     return [opts?.namespace, key].filter(Boolean).join('.');
  //   }
  //   // Normal translation call otherwise
  //   return originalT(key, values, formats);
  // };
}
