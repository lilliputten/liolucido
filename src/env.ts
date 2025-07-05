import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  // Server types
  server: {
    // This is optional because it's only used in development.
    // See https://next-auth.js.org/deployment.
    // BOT_USERNAME: z.string().min(1),
    AUTH_SECRET: z.string().min(1),
    USER_REQUIRED: z.enum(['true', 'false']).transform((v) => v === 'true'), // z.boolean(),
    DATABASE_URL: z.string().min(1),
    EMAIL_FROM: z.string().min(1),
    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    NEXTAUTH_URL: z.string().url().optional(),
    RESEND_API_KEY: z.string().min(1),
    YANDEX_CLIENT_ID: z.string().min(1),
    YANDEX_CLIENT_SECRET: z.string().min(1),
  },
  // Clent types
  client: {
    NEXT_PUBLIC_BOT_USERNAME: z.string().min(1),
    NEXT_PUBLIC_APP_URL: z.string().min(1),
  },
  // Runtime values
  runtimeEnv: {
    NEXT_PUBLIC_BOT_USERNAME: process.env.NEXT_PUBLIC_BOT_USERNAME,
    AUTH_SECRET: process.env.AUTH_SECRET,
    USER_REQUIRED: process.env.USER_REQUIRED,
    DATABASE_URL: process.env.DATABASE_URL,
    EMAIL_FROM: process.env.EMAIL_FROM,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    YANDEX_CLIENT_ID: process.env.YANDEX_CLIENT_ID,
    YANDEX_CLIENT_SECRET: process.env.YANDEX_CLIENT_SECRET,
  },
});
