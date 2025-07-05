import { z } from 'zod';

const envSchema = z.object({
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
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const error = new Error('Invalid environment variables');
  // eslint-disable-next-line no-console
  console.error(error.message, parsedEnv.error.flatten().fieldErrors, parsedEnv);
  debugger; // eslint-disable-line no-debugger
  throw error;
}

const env = parsedEnv.data;
export const app = env;
export type TAppEnv = z.infer<typeof envSchema>;

export const AUTH_SECRET = env.AUTH_SECRET;
export const USER_REQUIRED = env.USER_REQUIRED;
export const DATABASE_URL = env.DATABASE_URL;
export const EMAIL_FROM = env.EMAIL_FROM;
export const GITHUB_CLIENT_ID = env.GITHUB_CLIENT_ID;
export const GITHUB_CLIENT_SECRET = env.GITHUB_CLIENT_SECRET;
export const GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = env.GOOGLE_CLIENT_SECRET;
export const NEXTAUTH_URL = env.NEXTAUTH_URL;
export const RESEND_API_KEY = env.RESEND_API_KEY;
export const YANDEX_CLIENT_ID = env.YANDEX_CLIENT_ID;
export const YANDEX_CLIENT_SECRET = env.YANDEX_CLIENT_SECRET;
