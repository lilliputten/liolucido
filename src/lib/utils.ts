import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { publicAppUrl } from '@/config/env';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  return `${publicAppUrl}${path}`;
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
