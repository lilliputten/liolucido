import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

import { isDev } from '@/constants';

import { defaultLocale, localesList } from './types';

export const pathnames = {
  '/': '/',

  '/welcome': '/welcome',
  '/data': '/data',

  // Localized path example (for peoduction mode)
  '/info': isDev
    ? '/info'
    : {
        en: '/info',
        ru: '/информация',
      },
};

// @see https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: localesList,

  // Used when no locale matches
  defaultLocale,

  pathnames,
});

export type TRoutePath = keyof typeof routing.pathnames;

export const {
  // Lightweight wrappers around Next.js' navigation APIs that will consider the routing configuration
  Link,
  redirect,
  usePathname,
  useRouter,
  getPathname,
} = createNavigation(routing);
