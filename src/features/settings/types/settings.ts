import * as z from 'zod';

import { localesList } from '@/i18n/types';

const langUnion = localesList.map((lang) => z.literal(lang)) as [
  z.ZodLiteral<string>,
  z.ZodLiteral<string>,
  ...z.ZodLiteral<string>[],
];

// const langUnion = [z.literal('ru'), z.literal('en')] as const;
export const settingsSchema = z.object({
  userId: z.string().optional(),
  // lang: z.string().optional(),
  // lang: z.union([z.literal('ru'), z.literal('en')]),
  lang: z.union(langUnion).optional(),
  themeColor: z.string().optional(),
  darkTheme: z.boolean().optional(),
  showOthersTopics: z.boolean().optional(),
  langCode: z.string().optional(),
  langName: z.string().optional(),
  langCustom: z.boolean().optional(),
});

export type TSettings = z.infer<typeof settingsSchema>;

export const defaultSettings: TSettings = {};
