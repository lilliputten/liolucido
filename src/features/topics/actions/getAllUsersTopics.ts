'use server';

import { prisma } from '@/lib/db';
import { isDev } from '@/constants';

import { TTopic } from '../types';

export async function getAllUsersTopics() {
  try {
    if (isDev) {
      // DEBUG: Emulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    const topics: TTopic[] = await prisma.topic.findMany({
      // where: { userId },
    });
    return topics;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[getAllUsersTopics] catch', {
      error,
    });
    debugger; // eslint-disable-line no-debugger
    throw error;
  }
}
