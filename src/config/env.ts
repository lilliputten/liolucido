// This file should only be used in client components
import appInfo from '@/app-info.json';

// System
export const versionInfo = appInfo.versionInfo;

// Environment
export const isDev = process.env.NODE_ENV === 'development';
// NOTE: Beware direct console invocation
export const isProd = !isDev;

// Other params...
export const defaultLanguage = process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en';

export const publicAppUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://liolucido.vercel.app/';

export const dataContentType = 'application/json; charset=utf-8';

export const siteTitle = 'líolúcido';
export const siteDescription = 'NextJS memory training application';
export const siteKeywords = [
  // ...
  'next.js',
  'ai',
  'chat',
];
export const mailSupport = 'lilliputten@gmail.com';
