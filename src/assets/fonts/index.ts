import localFont from 'next/font/local';

import {
  // @see node_modules/next/dist/compiled/@next/font/dist/google/index.d.ts
  Inter,
  Noto_Sans_Display,
  // Urbanist,
  // Jaro,
  // Vollkorn,
  // Amatic_SC,
  // Yanone_Kaffeesatz,
  // Rubik_Mono_One,
  // Russo_One,
} from 'next/font/google';

export const fontDefault = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans',
});

export const fontHeading = Noto_Sans_Display({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-heading',
  weight: '700',
});

export const fontMono = localFont({
  src: './GeistMonoVF.woff',
  variable: '--font-mono',
});
