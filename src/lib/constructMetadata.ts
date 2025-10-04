import { Metadata } from 'next';

import { defaultLanguage, siteDescription, siteKeywords, siteTitle } from '@/config/env';
import { PUBLIC_URL } from '@/config/envServer';

interface TConstructMetadataParams {
  /*extends Partial<Pick<SiteConfig, 'title' | 'description' | 'keywords'>>*/ title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  icons?: string;
  noIndex?: boolean;
  locale?: string;
  url?: string;
}

/** Create html, oath, twitter and other meta data tags */
export function constructMetadata(params: TConstructMetadataParams = {}): Metadata {
  const {
    title = siteTitle,
    description = siteDescription,
    keywords = siteKeywords,
    image = '/static/opengraph-image.jpg',
    icons = '/favicon.ico',
    noIndex = true,
    locale = defaultLanguage, // routing.defaultLocale as TLocale,
    url = PUBLIC_URL,
  } = params;
  return {
    title,
    description,
    keywords,
    authors: [
      {
        name: 'lilliputten',
      },
    ],
    creator: 'lilliputten',
    openGraph: {
      type: 'website',
      locale, // 'en',
      url,
      title,
      description,
      siteName: title,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@lilliputten',
    },
    icons,
    metadataBase: new URL(url), // NOTE: It may break vercel build if there is a malformed url
    manifest: `${url}/site.webmanifest`,
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
