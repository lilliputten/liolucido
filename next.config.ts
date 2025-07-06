import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

// Import environments to ensure if they're ok
import './src/env/envServer';
import './src/env/envClient';

const isDev = process.env.NODE_ENV === 'development';

/* // Show loaded environment variables
 * declare global {
 *   var __IS_NEXT_STARTED: boolean | undefined;
 * }
 * if (isDev && !global.__IS_NEXT_STARTED) {
 *   global.__IS_NEXT_STARTED = true;
 *   console.log('Loaded app environment variables:', { ...envApp });
 *   console.log('Loaded client environment variables:', { ...envClient });
 * }
 */

// @see https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing
const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  /* experimental: {
   *   serverActions: {
   *     allowedOrigins: [
   *       // ...
   *       'https://03ql4p7l-3000.euw.devtunnels.ms/',
   *     ],
   *   },
   * },
   */
  compress: !isDev, // In favor of xtunnel (it loses `gzip` header)
  reactStrictMode: true,
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
  webpack: (config) => {
    return {
      ...config,
      watchOptions: {
        ignored: ['**/.*.sw?'],
      },
    };
  },
};

export default withNextIntl(nextConfig);
