'use server';

import { ExtendedUser } from '@/@types/next-auth';
import { Prisma } from '@prisma/client';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { TGetAvailableTopicsParams, TGetAvailableTopicsResults } from '@/lib/zod-schemes';
import { isDev } from '@/constants';

import { IncludedUserSelect, IncludedUserTopicWorkoutSelect } from '../types';

interface TOptions {
  noDebug?: boolean;
}

export async function getAvailableTopics(
  params: TGetAvailableTopicsParams & TOptions = {},
): Promise<TGetAvailableTopicsResults> {
  const {
    topicIds,
    skip, // = 0,
    take, // = itemsLimit,
    adminMode,
    showOnlyMyTopics,
    orderBy = { updatedAt: 'desc' },
    // TopicIncludeParamsSchema
    includeUser = false,
    includeWorkout = false,
    includeQuestionsCount = true,
    includeQuestions = false,
    // Options (no error console output and debugger stops, for tests)
    noDebug,
  } = params;
  if (isDev) {
    // DEBUG: Emulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  const user: ExtendedUser | undefined = await getCurrentUser();
  const userId = user?.id;
  const isAdmin = user?.role === 'ADMIN';
  try {
    // Check if conditions are correct...
    if (!user && showOnlyMyTopics) {
      throw new Error('Only authorized users can get their own data');
    }
    if (adminMode && !isAdmin) {
      throw new Error('Admin mode is allowed only for administrators');
    }
    if (!userId && showOnlyMyTopics && !adminMode) {
      return { items: [], totalCount: 0 };
    }
    // Create the "include" data...
    const include: Prisma.TopicInclude = {
      _count: { select: { questions: includeQuestionsCount } },
    };
    if (includeUser) {
      include.user = { select: IncludedUserSelect };
    }
    if (includeQuestions) {
      include.questions = true;
    }
    if (includeWorkout) {
      include.userTopicWorkout = { select: IncludedUserTopicWorkoutSelect };
    }
    // Create the "where" data...
    const where: Prisma.TopicWhereInput = {};
    if (!userId) {
      // Limit with public data for nonauthorized user in non-admin mode and without any other conditions
      where.isPublic = true;
    } else if (showOnlyMyTopics) {
      // Request only this user data
      where.userId = userId;
    } else if (!adminMode) {
      // Request public or this user data
      where.OR = [{ userId }, { isPublic: true }];
    }
    if (topicIds) {
      // Limit the results by specified ids
      where.id = { in: topicIds };
    }
    // Combine all the request arguments...
    const args: Prisma.TopicFindManyArgs = {
      skip,
      take,
      where,
      include,
      orderBy,
    };
    const [items, totalCount] = await prisma.$transaction([
      prisma.topic.findMany(args),
      prisma.topic.count({
        where,
      }),
    ]);
    // const topics: TAvailableTopic[] = await prisma.topic.findMany(args);
    return { items, totalCount } satisfies TGetAvailableTopicsResults;
  } catch (error) {
    if (!noDebug) {
      // eslint-disable-next-line no-console
      console.error('[getAvailableTopicsCore] catch', {
        error,
      });
      debugger; // eslint-disable-line no-debugger
    }
    throw error;
  }
}
