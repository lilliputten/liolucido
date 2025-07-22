import * as z from 'zod';

export const settingsSchema = z.object({
  userId: z.string().optional(),
  showOthersTopics: z.boolean().optional(),
  langCode: z.string().optional(),
  langName: z.string().optional(),
  langCustom: z.boolean().optional(),
});

export type TSettings = z.infer<typeof settingsSchema>;

export const defaultSettings: TSettings = {};
