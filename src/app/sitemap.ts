import { MetadataRoute } from 'next';

import { pathnames } from '@/config/routesConfig';
import { siteConfig } from '@/config/site';
import { getPathname, routing } from '@/i18n/routing';
import { TLocale } from '@/i18n/types';

type Href = Parameters<typeof getPathname>[0]['href'];

export default function sitemap(): MetadataRoute.Sitemap {
  return Object.values(pathnames).map((path) => getRouteEntry(path as Href));
}

function getRouteEntry(href: Href) {
  return {
    url: getFullUrl(href),
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((locale) => [locale, getFullUrl(href, locale as TLocale)]),
      ),
    },
  };
}

function getFullUrl(href: Href, locale?: TLocale) {
  const pathname = locale ? getPathname({ locale, href }) : href;
  return siteConfig.url + pathname;
}
