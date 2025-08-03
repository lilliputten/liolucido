'use server';

import { Prisma } from '@prisma/client';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { isDev } from '@/constants';

import { TTopic } from '../types';

interface TOptions {
  showOnlyMyTopics?: boolean;
}

export async function getAvailableTopics(opts: TOptions = {}) {
  const user = await getCurrentUser();
  const userId = user?.id;
  // const isAdmin = user?.role === 'ADMIN';
  try {
    if (isDev) {
      // DEBUG: Emulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    const include: Prisma.TopicInclude = {
      _count: { select: { questions: true } },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    };
    if (!userId && opts.showOnlyMyTopics) {
      return undefined;
    }
    const where: Prisma.TopicWhereInput = opts.showOnlyMyTopics
      ? {
          userId,
        }
      : {
          OR: [{ userId }, { isPublic: true }],
        };
    const topics: TTopic[] = await prisma.topic.findMany({
      where,
      include,
    });
    return topics;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[getAvailableTopics] catch', {
      error,
    });
    debugger; // eslint-disable-line no-debugger
    throw error;
  }
}
