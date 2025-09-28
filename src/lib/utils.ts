import { Metadata } from 'next';
import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { siteConfig } from '@/config/site';
import { routing } from '@/i18n/routing';
import { TLocale } from '@/i18n/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Create oath and other meta data tags */
export function constructMetadata({
  title = siteConfig.name,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  icons = '/favicon.ico',
  noIndex = false,
  locale = routing.defaultLocale as TLocale,
  url = siteConfig.url,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
  locale?: TLocale;
  url?: string;
} = {}): Metadata {
  return {
    title,
    description,
    keywords: [
      // ...
      'Next.js',
      'React',
      'Prisma',
      'líolúcido!',
      'Data',
      'Editor',
      'Sample',
    ],
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
    metadataBase: new URL(url),
    manifest: `${url}/site.webmanifest`,
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}

export function absoluteUrl(path: string) {
  return `${siteConfig.url}${path}`;
}

/* // UNUSED: fetcher -- a json data request sample. Required more advanced json parser (with try..fetch block)
 * export async function fetcher<JSON = unknown>(
 *   input: RequestInfo,
 *   init?: RequestInit,
 * ): Promise<JSON> {
 *   const res = await fetch(input, init);
 *
 *   if (!res.ok) {
 *     const json = await res.json();
 *     if (json.error) {
 *       const error = new Error(json.error) as Error & {
 *         status: number;
 *       };
 *       error.status = res.status;
 *       throw error;
 *     } else {
 *       throw new Error('An unexpected error occurred');
 *     }
 *   }
 *
 *   return res.json();
 * }
 */
