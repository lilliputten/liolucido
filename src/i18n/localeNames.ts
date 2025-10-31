import { TBroadLocale } from './types';

export const localeNames: Record<TBroadLocale, string> = {
  en: 'English',
  ru: 'Русский',
  es: 'Español',
  xx: 'Debug', // DEBUG
};

// @see https://en.wikipedia.org/wiki/Regional_indicator_symbol
export const localeSymbols: Record<TBroadLocale, string> = {
  en: '🇺🇸',
  ru: '🇷🇺',
  es: '🇪🇸',
  xx: '🇬🇬', // DEBUG
};
