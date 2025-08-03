'use server';

import { Prisma } from '@prisma/client';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { isDev } from '@/constants';

import { topicsLimit } from '../constants';
import { TAvailableTopic } from '../types';

interface TParams {
  skip?: number;
  take?: number;
  showOnlyMyTopics?: boolean;
  includeUser?: boolean;
  includeQuestionsCount?: boolean;
}

export async function getAvailableTopics(params: TParams = {}) {
  if (isDev) {
    // DEBUG: Emulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  const {
    skip = 0,
    take = topicsLimit,
    showOnlyMyTopics,
    includeUser = true,
    includeQuestionsCount = true,
  } = params;
  const user = await getCurrentUser();
  const userId = user?.id;
  // const isAdmin = user?.role === 'ADMIN';
  // No own topics for unauthorized users
  if (!userId && showOnlyMyTopics) {
    return [];
  }
  try {
    const include: Prisma.TopicInclude = {
      _count: { select: { questions: includeQuestionsCount } },
      user: includeUser
        ? {
            select: {
              id: true,
              name: true,
              email: true,
            },
          }
        : false,
    };
    const where: Prisma.TopicWhereInput = showOnlyMyTopics
      ? {
          userId,
        }
      : {
          OR: [{ userId }, { isPublic: true }],
        };
    const args: Prisma.TopicFindManyArgs = {
      skip,
      take,
      where,
      include,
    };
    const topics: TAvailableTopic[] = await prisma.topic.findMany(args);
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
