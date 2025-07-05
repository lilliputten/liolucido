/** @desc Re-export parsed and typed scss variables */

import * as cssVariables from './variables.module.scss';

// See pre-exports in `variables-export.scss`
export interface TVariables {
  // Colors

  primaryColor: string;
  primaryForegroundColor: string;
  secondaryColor: string;
  secondaryForegroundColor: string;
  appDestructiveColor: string;
  appDestructiveForegroundColor: string;

  // Themed colors (light)

  backgroundLightColor: string;
  foregroundLightColor: string;
  cardLightColor: string;
  cardForegroundLightColor: string;
  popoverLightColor: string;
  popoverForegroundLightColor: string;
  mutedLightColor: string;
  mutedForegroundLightColor: string;
  accentLightColor: string;
  accentForegroundLightColor: string;
  destructiveLightColor: string;
  destructiveForegroundLightColor: string;
  errorLightColor: string;
  borderLightColor: string;
  inputLightColor: string;
  ringLightColor: string;

  // Themed colors (dark)

  backgroundDarkColor: string;
  foregroundDarkColor: string;
  cardDarkColor: string;
  cardForegroundDarkColor: string;
  popoverDarkColor: string;
  popoverForegroundDarkColor: string;
  mutedDarkColor: string;
  mutedForegroundDarkColor: string;
  accentDarkColor: string;
  accentForegroundDarkColor: string;
  destructiveDarkColor: string;
  destructiveForegroundDarkColor: string;
  errorDarkColor: string;
  borderDarkColor: string;
  inputDarkColor: string;
  ringDarkColor: string;

  // Chart colors

  chart1Color: string;
  chart2Color: string;
  chart3Color: string;
  chart4Color: string;
  chart5Color: string;

  // Adaptive layouts

  smallTreshold: string;
  smallTresholdPx: number;
  mobileTreshold: string;
  mobileTresholdPx: number;
  wideTreshold: string;
  wideTresholdPx: number;

  // Delays

  transitionTimeMs: string;
  transitionTimeMsPx: number;
  animationTimeMs: string;
  animationTimeMsPx: number;
  disappearTimeMs: string;
  disappearTimeMsPx: number;
}

const vars = cssVariables as unknown as TVariables;

const {
  // Colors

  primaryColor,
  primaryForegroundColor,
  secondaryColor,
  secondaryForegroundColor,
  appDestructiveColor,
  appDestructiveForegroundColor,

  // Themed colors (light)

  backgroundLightColor,
  foregroundLightColor,
  cardLightColor,
  cardForegroundLightColor,
  popoverLightColor,
  popoverForegroundLightColor,
  mutedLightColor,
  mutedForegroundLightColor,
  accentLightColor,
  accentForegroundLightColor,
  destructiveLightColor,
  destructiveForegroundLightColor,
  errorLightColor,
  borderLightColor,
  inputLightColor,
  ringLightColor,

  // Themed colors (dark)

  backgroundDarkColor,
  foregroundDarkColor,
  cardDarkColor,
  cardForegroundDarkColor,
  popoverDarkColor,
  popoverForegroundDarkColor,
  mutedDarkColor,
  mutedForegroundDarkColor,
  accentDarkColor,
  accentForegroundDarkColor,
  destructiveDarkColor,
  destructiveForegroundDarkColor,
  errorDarkColor,
  borderDarkColor,
  inputDarkColor,
  ringDarkColor,

  // Chart colors

  chart1Color,
  chart2Color,
  chart3Color,
  chart4Color,
  chart5Color,

  // Adaptive layouts

  smallTreshold,
  mobileTreshold,
  wideTreshold,

  // Delays

  transitionTimeMs,
  animationTimeMs,
  disappearTimeMs,
} = vars;

const smallTresholdPx = parseInt(smallTreshold);
const mobileTresholdPx = parseInt(mobileTreshold);
const wideTresholdPx = parseInt(wideTreshold);

const transitionTimeMsPx = parseInt(transitionTimeMs);
const animationTimeMsPx = parseInt(animationTimeMs);
const disappearTimeMsPx = parseInt(disappearTimeMs);

export {
  // Colors
  primaryColor,
  primaryForegroundColor,
  secondaryColor,
  secondaryForegroundColor,
  appDestructiveColor,
  appDestructiveForegroundColor,

  // Themed colors (light)
  backgroundLightColor,
  foregroundLightColor,
  cardLightColor,
  cardForegroundLightColor,
  popoverLightColor,
  popoverForegroundLightColor,
  mutedLightColor,
  mutedForegroundLightColor,
  accentLightColor,
  accentForegroundLightColor,
  destructiveLightColor,
  destructiveForegroundLightColor,
  errorLightColor,
  borderLightColor,
  inputLightColor,
  ringLightColor,

  // Themed colors (dark)
  backgroundDarkColor,
  foregroundDarkColor,
  cardDarkColor,
  cardForegroundDarkColor,
  popoverDarkColor,
  popoverForegroundDarkColor,
  mutedDarkColor,
  mutedForegroundDarkColor,
  accentDarkColor,
  accentForegroundDarkColor,
  destructiveDarkColor,
  destructiveForegroundDarkColor,
  errorDarkColor,
  borderDarkColor,
  inputDarkColor,
  ringDarkColor,

  // Chart colors
  chart1Color,
  chart2Color,
  chart3Color,
  chart4Color,
  chart5Color,

  // Adaptive layouts
  smallTreshold,
  smallTresholdPx,
  mobileTreshold,
  mobileTresholdPx,
  wideTreshold,
  wideTresholdPx,

  // Delays
  transitionTimeMs,
  transitionTimeMsPx,
  animationTimeMs,
  animationTimeMsPx,
  disappearTimeMs,
  disappearTimeMsPx,
};
