'use server';

import { Prisma } from '@prisma/client';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { isDev } from '@/constants';

import { topicsLimit } from '../constants';
import { TAvailableTopic } from '../types';

interface TParams {
  /** Skip records (start from the nth record), default = 0 */
  skip?: number;
  /** Amount of records to return, default = {topicsLimit} */
  take?: number;
  /** Display only current user's topics */
  showOnlyMyTopics?: boolean;
  /** Unclude compact user info data (name, email) in the `user` property of result object */
  includeUser?: boolean;
  /** Include related questions count, in `_count: { questions }` */
  includeQuestionsCount?: boolean;
  /** Sort by parameter, default: `{ createdAt: 'desc' }` */
  orderBy?: Prisma.TopicFindManyArgs['orderBy'];
}

interface TGetAvailableTopicsResults {
  topics: TAvailableTopic[];
  /** Total records count for these conditions */
  totalCount: number;
}

export async function getAvailableTopics(
  params: TParams = {},
): Promise<TGetAvailableTopicsResults> {
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
    orderBy = { createdAt: 'desc' },
  } = params;
  const user = await getCurrentUser();
  const userId = user?.id;
  // const isAdmin = user?.role === 'ADMIN';
  // No own topics for unauthorized users
  if (!userId && showOnlyMyTopics) {
    return { topics: [], totalCount: 0 };
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
      ? { userId }
      : { OR: [{ userId }, { isPublic: true }] };
    const args: Prisma.TopicFindManyArgs = {
      skip,
      take,
      where,
      include,
      orderBy,
    };
    const [topics, totalCount] = await prisma.$transaction([
      prisma.topic.findMany(args),
      prisma.topic.count({
        where,
      }),
    ]);
    // const topics: TAvailableTopic[] = await prisma.topic.findMany(args);
    return { topics, totalCount } satisfies TGetAvailableTopicsResults;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[getAvailableTopics] catch', {
      error,
    });
    debugger; // eslint-disable-line no-debugger
    throw error;
  }
}
