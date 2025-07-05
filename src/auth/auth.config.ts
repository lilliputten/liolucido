import type { NextAuthConfig } from 'next-auth';
import Github from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import Yandex from 'next-auth/providers/yandex';

import { env } from '@/env';

// import Resend from 'next-auth/providers/resend';
// import { sendVerificationRequest } from '@/lib/email';

import { telegramProvider } from './telegram-provider';

export default {
  providers: [
    Github({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
    Yandex({
      clientId: env.YANDEX_CLIENT_ID,
      clientSecret: env.YANDEX_CLIENT_SECRET,
    }),
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
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
