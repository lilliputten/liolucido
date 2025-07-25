import { Icon, Icons } from '@/components/shared/icons';

export const systemThemeIds = ['light', 'dark', 'system'] as const;
export type TSystemThemeId = (typeof systemThemeIds)[number];
export const defaultSystemTheme: TSystemThemeId = 'system';
export const systemThemeIcons: Record<TSystemThemeId, Icon> = {
  light: Icons.sun,
  dark: Icons.moon,
  system: Icons.laptop,
};
