import type { NextAuthConfig } from 'next-auth';
import Github from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import Yandex from 'next-auth/providers/yandex';

import { envServer } from '@/env/envServer';

// import Resend from 'next-auth/providers/resend';
// import { sendVerificationRequest } from '@/lib/email';

import { telegramProvider } from './telegram-provider';

export default {
  providers: [
    Github({
      clientId: envServer.GITHUB_CLIENT_ID,
      clientSecret: envServer.GITHUB_CLIENT_SECRET,
    }),
    Yandex({
      clientId: envServer.YANDEX_CLIENT_ID,
      clientSecret: envServer.YANDEX_CLIENT_SECRET,
    }),
    Google({
      clientId: envServer.GOOGLE_CLIENT_ID,
      clientSecret: envServer.GOOGLE_CLIENT_SECRET,
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
