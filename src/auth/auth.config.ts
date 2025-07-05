import type { NextAuthConfig } from 'next-auth';
import Github from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import Yandex from 'next-auth/providers/yandex';

import * as envApp from '@/env/app';

// import Resend from 'next-auth/providers/resend';
// import { sendVerificationRequest } from '@/lib/email';

import { telegramProvider } from './telegram-provider';

export default {
  providers: [
    Github({
      clientId: envApp.GITHUB_CLIENT_ID,
      clientSecret: envApp.GITHUB_CLIENT_SECRET,
    }),
    Yandex({
      clientId: envApp.YANDEX_CLIENT_ID,
      clientSecret: envApp.YANDEX_CLIENT_SECRET,
    }),
    Google({
      clientId: envApp.GOOGLE_CLIENT_ID,
      clientSecret: envApp.GOOGLE_CLIENT_SECRET,
    }),
    /* Resend({
     *   apiKey: env.RESEND_API_KEY,
     *   from: env.EMAIL_FROM,
     *   sendVerificationRequest,
     * }),
     */
    telegramProvider,
  ],
} satisfies NextAuthConfig;
