'use server';

import { Prisma } from '@prisma/client';

import { TApiResponse } from '@/shared/types/api';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { isDev } from '@/constants';

import { TTopic, TTopicId } from '../types';

export async function getTopic(id: TTopicId): Promise<TApiResponse<TTopic | null>> {
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
      _count: { select: { questions: true } },
    };
    const topic: TTopic | undefined =
      (await prisma.topic.findUnique({
        where,
        include,
      })) || undefined;
    if (topic) {
      // Check if the current user is allowed to see the topic?
      if (!topic.isPublic && userId !== topic?.userId && user?.role !== 'ADMIN') {
        return {
          data: null,
          ok: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Not allowed to access this topic',
          },
        };
      }
    }
    return {
      data: topic || null,
      ok: true,
      // TODO: Add invalidation keys for React Query
      // invalidateKeys: [`topic-${id}`],
      // TODO: Add service messages for client display
      // messages: topic ? [] : [{ type: 'info', message: 'Topic not found' }],
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[getTopic] catch', {
      error,
    });
    debugger; // eslint-disable-line no-debugger

    return {
      data: null,
      ok: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch topic',
        details: { error: error instanceof Error ? error.message : String(error) },
      },
    };
  }
}
