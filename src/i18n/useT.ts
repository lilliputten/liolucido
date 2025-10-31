import {
  Formats,
  RichTranslationValues,
  TranslationValues,
  useLocale,
  useTranslations as useNextIntlTranslations,
} from 'next-intl';

import { debugLocale, debugTranslations } from '@/config';

import { getDebugT } from './getDebugT';

export function useT(namespace?: string) {
  const originalT = useNextIntlTranslations(namespace);
  const locale = useLocale();
  const isDebugLocale = debugTranslations || (debugLocale && locale === debugLocale);

  const t1 = (key: string, values?: TranslationValues, formats?: Formats): string => {
    if (isDebugLocale) {
      return [namespace, key].filter(Boolean).join('.');
    }
    return originalT(key, values, formats);
  };

  return Object.assign(t1, {
    rich: (key: string, values?: RichTranslationValues, formats?: Formats) => {
      if (isDebugLocale) {
        return [namespace, key].filter(Boolean).join('.');
      }
      return originalT.rich(key, values, formats);
    },
  });
}

/*
 * export function useT(namespace?: string) {
 *   const locale = useLocale();
 *   const isDebugLocale = debugTranslations || (debugLocale && locale === debugLocale);
 *
 *   const t0 = (key: string, _values?: TranslationValues, _formats?: Formats): string => {
 *     return [namespace, key].filter(Boolean).join('.');
 *   };
 *   const t = Object.assign(t0, {
 *     rich: (key: string, _values?: RichTranslationValues, _formats?: Formats) => {
 *       return [namespace, key].filter(Boolean).join('.');
 *     },
 *   });
 *
 *   try {
 *     const originalT = useNextIntlTranslations(namespace);
 *
 *     if (isDebugLocale) {
 *       // return getDebugT(namespace);
 *       return t;
 *     }
 *
 *     return originalT;
 *   } catch (error) {
 *     // eslint-disable-next-line no-console
 *     console.error('[useT]', {
 *       error,
 *       namespace,
 *       locale,
 *     });
 *     debugger; // eslint-disable-line no-debugger
 *     return t;
 *     // return getDebugT(namespace);
 *   }
 * }
 */
