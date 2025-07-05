import { useLocale } from 'next-intl';

import { getLocalePrefixedRoute } from '@/lib/routes';
import { TLocale } from '@/i18n/types';

export function useRouteWithLocalePrefix(route: string) {
  const defaultLocale = useLocale() as TLocale;
  return getLocalePrefixedRoute(route, defaultLocale);
}
