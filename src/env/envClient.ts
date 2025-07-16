import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_BOT_USERNAME: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().min(1),
  NEXT_PUBLIC_USER_REQUIRED: z.enum(['true', 'false']).transform((v) => v === 'true'), // z.boolean(),
});

const processEnv = {
  NEXT_PUBLIC_BOT_USERNAME: process.env.NEXT_PUBLIC_BOT_USERNAME,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_USER_REQUIRED: process.env.NEXT_PUBLIC_USER_REQUIRED,
};

const parsedEnv = envSchema.safeParse(processEnv);

if (!parsedEnv.success) {
  const error = new Error('Invalid client environment variables');
  // eslint-disable-next-line no-console
  console.error(error.message, parsedEnv.error.flatten().fieldErrors, parsedEnv, processEnv);
  debugger; // eslint-disable-line no-debugger
  throw error;
}

const env = parsedEnv.data;
export const envClient = env;
export type TClientEnv = z.infer<typeof envSchema>;

// export const NEXT_PUBLIC_BOT_USERNAME = env.NEXT_PUBLIC_BOT_USERNAME;
// export const NEXT_PUBLIC_APP_URL = env.NEXT_PUBLIC_APP_URL;
