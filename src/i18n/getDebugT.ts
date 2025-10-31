import { Formats, RichTranslationValues, TranslationValues } from 'next-intl';

// type RichTranslationValues = Record<string, (chunks: React.ReactNode) => React.ReactNode>;

export function getDebugT(namespace?: string) {
  const t0 = function t(key: string, _values?: TranslationValues, _formats?: Formats): string {
    return [namespace, key].filter(Boolean).join('.');
  };
  const t = Object.assign(t0, {
    rich: (key: string, _values?: RichTranslationValues, _formats?: Formats) => {
      return [namespace, key].filter(Boolean).join('.');
    },
  });
  return t;
}
