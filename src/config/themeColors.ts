// It's used in `tailwind.config.ts` to create generic theme configuration, and
// in `next.config.ts` to pass the variables to scss environment.
// See also the usage in: `styles/globals.scss`.

export const primaryColor = '#818';
export const primaryForegroundColor = '#fff';
export const secondaryColor = '#fb1';
export const secondaryForegroundColor = '#000';

export const themeColorIds = ['brand', 'blue'] as const;
export const defaultThemeColor: TThemeColorId = 'brand';
export type TThemeColorId = (typeof themeColorIds)[number];
interface TThemeColorData {
  /* Initial color, for the default or `*-500` value */
  color: string;
  /** Percentage fix for the final color value adjustment, optional, default value is '0%' */
  fix?: number | string;
}
export const themeColorData: Record<TThemeColorId, TThemeColorData> = {
  brand: { color: primaryColor, fix: 20 },
  // See for tailwind color definitions:
  // https://tailwindcss.com/docs/colors
  blue: { color: 'oklch(62.3% 0.214 259.815)' },
};
