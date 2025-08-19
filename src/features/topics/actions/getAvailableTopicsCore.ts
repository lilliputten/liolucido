'use server';

import { ExtendedUser } from '@/@types/next-auth';
import { Prisma } from '@prisma/client';

import { prisma } from '@/lib/db';
import { isDev } from '@/constants';

// import { TExtendedUser } from '@/features/users/types/TUser';

import { topicsLimit } from '../constants';
import { TGetAvailableTopicsParams, TGetAvailableTopicsResults } from './getAvailableTopicsSchema';

/** Testable low-level of getAvailableTopics code which accepts a current user
 * alongside other options (a temporarily solution used due to inability of
 * jest to trsnspile `@auth/prisma-adapter` correctly) */
export async function getAvailableTopicsCore(
  params: TGetAvailableTopicsParams & { user?: ExtendedUser },
): Promise<TGetAvailableTopicsResults> {
  if (isDev) {
    // DEBUG: Emulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  const {
    skip = 0,
    take = topicsLimit,
    adminMode,
    showOnlyMyTopics,
    includeUser = true,
    includeQuestionsCount = true,
    orderBy = { createdAt: 'desc' },
    user,
  } = params;
  // const user: ExtendedUser | undefined = undefined; //await getCurrentUser();
  const userId = user?.id;
  const isAdmin = user?.role === 'ADMIN';
  // No own topics for unauthorized users (and if no admin mode)
  try {
    if (!user && showOnlyMyTopics) {
      throw new Error('Only authorized users can get their own data');
    }
    if (adminMode && !isAdmin) {
      throw new Error('Admin mode is allowed only for administrators');
    }
    if (!userId && showOnlyMyTopics && !adminMode) {
      return { topics: [], totalCount: 0 };
    }
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
    const where: Prisma.TopicWhereInput = {};
    if (!userId) {
      if (!adminMode) {
        // Limit with public data for nonauthorized user in non-admin mode and without any other conditions
        where.isPublic = true;
      }
    } else if (showOnlyMyTopics) {
      // Request only this user data
      where.userId = userId;
    } else {
      // Request public or this user data
      where.OR = [{ userId }, { isPublic: true }];
    }
    /*
    const where: Prisma.TopicWhereInput = showOnlyMyTopics
      ? { userId }
      : { OR: [{ userId }, { isPublic: true }] };
    */
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
    console.error('[getAvailableTopicsCore] catch', {
      error,
    });
    debugger; // eslint-disable-line no-debugger
    throw error;
  }
}
