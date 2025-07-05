/** Bot token see `.env:BOT_TOKEN`. Mind the development bot. */
export const token: string = process.env.BOT_TOKEN || '';
if (!token) {
  throw new Error('No telegram bot token environment variable provided (BOT_TOKEN)');
}

/** Use xtunnel for local development (see `.env:NEXTAUTH_URL,NEXT_PUBLIC_APP_URL`). */
export const appHost: string = process.env.VERCEL_URL
  ? 'https://' + process.env.VERCEL_URL
  : process.env.NEXT_PUBLIC_APP_URL || '';

if (!appHost) {
  throw new Error('No webapp host provided (NEXT_PUBLIC_APP_URL or VERCEL_URL)');
}

/** Full telegram web app url. */
export const webAppUrl = `${appHost}/miniapp`;
