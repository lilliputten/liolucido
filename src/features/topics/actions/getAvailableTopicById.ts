'use server';

import { Prisma } from '@prisma/client';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { isDev } from '@/constants';

import { IncludedUserSelect, IncludedUserTopicWorkoutSelect, TTopic } from '../types';
import { TGetAvailableTopicByIdParams } from './getAvailableTopicByIdSchema';

interface TOptions {
  noDebug?: boolean;
}

export async function getAvailableTopicById(params: TGetAvailableTopicByIdParams & TOptions) {
  const {
    id,
    // TopicIncludeParamsSchema:
    includeUser = true,
    includeWorkout = false,
    includeQuestionsCount = true,
  } = params;
  // Check user rights to delete the question...?
  const user = await getCurrentUser();
  const userId = user?.id;
  // const isAdmin = user?.role === 'ADMIN';
  try {
    if (isDev) {
      // DEBUG: Emulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    const where: Prisma.TopicWhereUniqueInput = {
      id,
      /* // TODO: Restrict isPublic if it isn't an admin user?
       * isPublic: isAdmin ? null : false,
       */
    };
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
    if (includeUser) {
      include.user = { select: IncludedUserSelect };
    }
    if (includeWorkout) {
      include.userTopicWorkout = { select: IncludedUserTopicWorkoutSelect };
    }
    const topic: TTopic | undefined =
      (await prisma.topic.findUnique({
        where,
        include,
      })) || undefined;
    if (!topic) {
      throw new Error('No topic found');
    }
    // Check if the current user is allowed to see the topic?
    if (!topic.isPublic && userId !== topic?.userId && user?.role !== 'ADMIN') {
      throw new Error('Current user is not allowed to access the topic');
    }
    return topic;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[getAvailableTopicById] catch', {
      error,
    });
    debugger; // eslint-disable-line no-debugger
    throw error;
  }
}
