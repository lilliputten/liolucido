import { pathnames } from '@/i18n/routing';
import { localesList, TLocale } from '@/i18n/types';

const localizedPrefixRegStr = `^/(${localesList.join('|')})/`;
const localizedPrefixRegExp = new RegExp(localizedPrefixRegStr);

type PathKey = keyof typeof pathnames;

export function getLocalizedRoute(route: string, locale: TLocale) {
  const pathKeys = Object.keys(pathnames);
  if (pathKeys.includes(route)) {
    const item = pathnames[route as PathKey];
    if (typeof item === 'object') {
      return item[locale];
    }
  }
}

export function getLocalePrefixedRoute(route: string, locale: TLocale) {
  if (!route || !locale) {
    return route;
  }
  if (!route.match(localizedPrefixRegExp)) {
    return `/${locale}${route}`;
  }
  return route;
}

export function getAllRouteSynonyms(route: string, locale: TLocale) {
  const prefixedRoute = getLocalePrefixedRoute(route, locale);
  const localizedRoute = getLocalizedRoute(route, locale);
  const prefixedLocalizedRoute = localizedRoute && getLocalePrefixedRoute(localizedRoute, locale);
  const routesList = [
    // All the paths represent the root path
    route,
    prefixedRoute,
    localizedRoute,
    prefixedLocalizedRoute,
  ].filter(Boolean);
  return routesList;
}
