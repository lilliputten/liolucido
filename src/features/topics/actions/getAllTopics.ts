'use server';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { isDev } from '@/constants';

import { TTopic } from '../types';

export async function getAllTopics() {
  try {
    if (isDev) {
      // DEBUG: Emulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    /* // DEMO: Show an error
     * throw new Error('Test error');
     */
    const user = await getCurrentUser();
    const userId = user?.id;
    if (userId) {
      const topics: TTopic[] = await prisma.topic.findMany({
        where: { userId },
      });
      return topics;
    }
    return undefined;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[getAllTopics] catch', {
      error,
    });
    debugger; // eslint-disable-line no-debugger
    throw error;
  }
}
