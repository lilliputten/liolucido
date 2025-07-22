'use server';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { isDev } from '@/constants';

export async function getSettings() {
  try {
    if (isDev) {
      // DEBUG: Emulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    const user = await getCurrentUser();
    const userId = user?.id;
    if (userId) {
      const settings = await prisma.userSettings.findUnique({
        where: { userId },
      });
      return settings;
    }
    return undefined;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[getSettings] Caught error', {
      error,
    });
    debugger; // eslint-disable-line no-debugger
    throw error;
  }
}
