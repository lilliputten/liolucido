'use server';

import { Prisma } from '@prisma/client';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { isDev } from '@/constants';

import { TTopic } from '../types';

export async function getThisUserTopics() {
  const user = await getCurrentUser();
  const userId = user?.id;
  // const isAdmin = user?.role === 'ADMIN';
  try {
    if (isDev) {
      // DEBUG: Emulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    if (!userId) {
      // TODO: To throw an error if no user is authorized?
      throw new Error('User should be authorized to be able to get his own topics.');
      // return undefined;
    }
    const include: Prisma.TopicInclude = {
      _count: { select: { questions: true } },
    };
    const where: Prisma.TopicWhereInput = {
      userId,
      // TODO: Restrict isPublic if it isn't an admin user?
      // isPublic: isAdmin ? null : false,
    };
    const topics: TTopic[] = await prisma.topic.findMany({
      where,
      include,
    });
    return topics;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[getThisUserTopics] catch', {
      error,
    });
    debugger; // eslint-disable-line no-debugger
    throw error;
  }
}
