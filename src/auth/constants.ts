import { isProd } from '@/config';

/** Relative time from now in seconds when to expire the session */
export const sessionMaxAge = 30 * 24 * 60 * 60; // 30 days in seconds (default)
/** How often the session should be updated in seconds. If set to 0, session is updated every time. */
export const sessionUpdateAge = 24 * 60 * 60; // optional rolling session update interval

/// Cookies...

// TODO: To get the cookie name from next-auth?
const cookiePrefix = isProd ? '__Secure-' : '';
/** Cookie name */
export const cookieName = `${cookiePrefix}authjs.session-token`;
