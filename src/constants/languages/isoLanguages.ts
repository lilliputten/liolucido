import { TLanguage } from '@/shared/types/language';

import jsonLanguages from './ISO-639-1-language.json';

/* // Derive types (is it required?)
 * import { ArrayElement } from '@/shared/types/ts';
 * type TISOLanguages = typeof jsonLanguages;
 * type TISOLanguage = ArrayElement<TISOLanguages>;
 */

export const isoLanguages = jsonLanguages.map(
  ({ code, name }) => ({ id: code, name }) as TLanguage,
);
