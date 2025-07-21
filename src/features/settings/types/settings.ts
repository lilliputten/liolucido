import * as z from 'zod';

export const settingsLocalStoragePrefix = 'settings-';

export const settingsSchema = z.object({
  showOthersTopics: z.boolean().optional(),
});

export type TSettings = z.infer<typeof settingsSchema>;

export const defaultSettings: TSettings = {};
