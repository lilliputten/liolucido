'use server';

import { Prisma } from '@prisma/client';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { isDev } from '@/constants';

import { TTopic } from '../types';

export async function getThisUserTopics() {
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
      const include: Prisma.TopicInclude = {
        _count: { select: { questions: true } },
      };
      const topics = await prisma.topic.findMany({
        where: { userId },
        include,
      });
      return topics;
    }
    return undefined;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[getThisUserTopics] catch', {
      error,
    });
    debugger; // eslint-disable-line no-debugger
    throw error;
  }
}
