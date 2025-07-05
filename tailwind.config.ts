import tailwindcssTypography from '@tailwindcss/typography';
import { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';
import { fontFamily } from 'tailwindcss/defaultTheme';

import { getColorSpread } from './build-utils/getColorSpread';
// NOTE: It's not possible to export css modules on this stage
import { primaryColor, secondaryColor } from './src/config/theme';

// Core app color definitions
// UNUSED? Construct primary/secondary colors spread tables
// (with keys 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950) from key colors.
const primaryColorSpread = getColorSpread('primary', primaryColor);
const secondaryColorSpread = getColorSpread('secondary', secondaryColor);

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  prefix: '',
  theme: {
    extend: {
      colors: {
        background: 'var(--backgroundColor)',
        foreground: 'var(--foregroundColor)',
        ...primaryColorSpread,
        ...secondaryColorSpread,
        border: 'var(--borderColor)',
        input: 'var(--inputColor)',
        ring: 'var(--ringColor)',
        backgroundLight: 'var(--backgroundLightColor)',
        foregroundLight: 'var(--foregroundLightColor)',
        backgroundDark: 'var(--backgroundDarkColor)',
        foregroundDark: 'var(--foregroundDarkColor)',
        destructive: {
          DEFAULT: 'var(--appDestructiveColor)',
          foreground: 'var(--appDestructiveForegroundColor)',
        },
        error: {
          // DEFAULT: 'var(--backgroundColor)',
          DEFAULT: 'var(--errorColor)',
        },
        muted: {
          DEFAULT: 'var(--mutedColor)',
          foreground: 'var(--mutedForegroundColor)',
        },
        accent: {
          DEFAULT: 'var(--accentColor)',
          foreground: 'var(--accentForegroundColor)',
        },
        popover: {
          DEFAULT: 'var(--popoverColor)',
          foreground: 'var(--popoverForegroundColor)',
        },
        card: {
          DEFAULT: 'var(--cardColor)',
          foreground: 'var(--cardForegroundColor)',
        },
      },
      borderRadius: {
        lg: 'var(--borderRadiusSize)',
        md: 'calc(var(--borderRadiusSize) - 2px)',
        sm: 'calc(var(--borderRadiusSize) - 4px)',
      },
      fontFamily: {
        default: ['var(--font-default)', ...fontFamily.sans],
        heading: ['var(--font-heading)', ...fontFamily.sans],
        mono: ['var(--font-mono)', ...fontFamily.mono],
        // sans: ['var(--font-sans)', ...fontFamily.sans],
        // urban: ['var(--font-urban)', ...fontFamily.sans],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        // Fade up and down
        'fade-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          '80%': {
            opacity: '0.7',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0px)',
          },
        },
        'fade-down': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-10px)',
          },
          '80%': {
            opacity: '0.6',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0px)',
          },
        },
        // Fade in and out
        'fade-in': {
          '0%': {
            opacity: '0',
          },
          '50%': {
            opacity: '0.6',
          },
          '100%': {
            opacity: '1',
          },
        },
        'fade-out': {
          '0%': {
            opacity: '0',
          },
          '50%': {
            opacity: '0.6',
          },
          '100%': {
            opacity: '1',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',

        // Fade up and down
        'fade-up': 'fade-up 0.5s',
        'fade-down': 'fade-down 0.5s',

        // Fade in and out
        'fade-in': 'fade-in 0.4s',
        'fade-out': 'fade-out 0.4s',
      },
      transitionDuration: {
        '2000': '2000ms',
      },
    },
  },
  plugins: [tailwindcssAnimate, tailwindcssTypography],
} satisfies Config;
