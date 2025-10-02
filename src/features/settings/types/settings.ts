import * as z from 'zod';

/* // UNUSED: Attempts to make definitions more precise
 * import { localesList } from '@/i18n/types';
 * // const localeUnion = [z.literal('ru'), z.literal('en')] as const;
 * const localeUnion = localesList.map((lang) => z.literal(lang)) as [
 *   z.ZodLiteral<string>,
 *   z.ZodLiteral<string>,
 *   ...z.ZodLiteral<string>[],
 * ];
 * const themeUnion = [z.literal('dark'), z.literal('light'), z.literal('system')] as const;
 */

export const settingsSchema = z.object({
  userId: z.string().optional(),
  locale: z.string().optional(),
  // locale: z.union([z.literal('ru'), z.literal('en')]),
  // locale: z.union(localeUnion).optional(),
  // theme: z.union(themeUnion).optional(),
  testInput: z.string().optional(),
  testTextarea: z.string().optional(),
  theme: z.string().optional(),
  themeColor: z.string().optional(),
  showOnlyMyTopics: z.boolean().optional(),
  langCode: z.string().optional(),
  langName: z.string().optional(),
  langCustom: z.boolean().optional(),
});
export const settingsSchemaKeys = settingsSchema.keyof().options;
/** To use as a data base on save, to override default values for absent keys */
export const nulledSettings = settingsSchemaKeys.reduce<Record<string, null>>((obj, key) => {
  obj[key] = null;
  return obj;
}, {});

export type TSettings = z.infer<typeof settingsSchema>;

export const defaultSettings: TSettings = {};
