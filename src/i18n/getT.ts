'use server';

import { getLocale, getTranslations as nextIntlGetTranslations } from 'next-intl/server';

import { debugLocale, debugTranslations } from '@/config';

import { getDebugT } from './getDebugT';

export async function getT(opts?: { locale?: string; namespace?: string }) {
  const locale = await getLocale();
  const isDebugLocale = debugTranslations || locale === debugLocale;
  if (isDebugLocale) {
    return getDebugT(opts?.namespace);
  }
  return await nextIntlGetTranslations(opts);
}
