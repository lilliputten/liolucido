'use server';

import {
  // BOT_TOKEN,
  BOT_USERNAME,
  isDev,
  isVercel,
  isVercelPreview,
  isVercelProduction,
  NEXT_PUBLIC_APP_URL,
  NODE_ENV,
  PUBLIC_URL,
  VERCEL_ENV,
  VERCEL_PROJECT_PRODUCTION_URL,
  VERCEL_URL,
  WEBHOOK_HOST,
} from '@/config/envServer';
import { versionInfo } from '@/config';

export async function getServerInfo() {
  try {
    return {
      versionInfo,
      VERCEL_ENV,
      NODE_ENV,
      NEXT_PUBLIC_APP_URL,
      // Vercel
      VERCEL_PROJECT_PRODUCTION_URL,
      VERCEL_URL,
      PUBLIC_URL,
      BOT_USERNAME,
      WEBHOOK_HOST,
      // BOT_TOKEN,
      isDev,
      isVercel,
      isVercelPreview,
      isVercelProduction,
    };
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    // eslint-disable-next-line no-console
    console.error('[StartBotPage:getServerInfo]', errMsg, { error });
    debugger; // eslint-disable-line no-debugger
    throw error;
  }
}
