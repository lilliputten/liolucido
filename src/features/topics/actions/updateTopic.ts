'use server';

import { TApiResponse } from '@/shared/types/api';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { isDev } from '@/constants';
import { TOptionalTopic, TTopic } from '@/features/topics/types';

export async function updateTopic(topic: TTopic): Promise<TApiResponse<TTopic>> {
  const user = await getCurrentUser();
  const userId = user?.id;
  try {
    if (isDev) {
      // DEBUG: Emulate network delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
    if (!userId) {
      return {
        data: null,
        ok: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      };
    }
    if (!topic.name) {
      return {
        data: null,
        ok: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Topic name is required',
        },
      };
    }
    /* NOTE: Ensure if the user exists (should be checked on the page load)
     * const isUserExists = await checkIfUserExists(userId);
     * if (!isUserExists) {
     *   throw new Error('The specified user does not exist.');
     * }
     */
    const data = { ...topic } as TOptionalTopic;
    delete data.userId;
    delete data._count;
    delete data.createdAt;
    delete data.updatedAt;
    const updatedTopic = await prisma.topic.update({
      where: { id: topic.id, userId },
      data,
    });

    return {
      data: updatedTopic as TTopic,
      ok: true,
      // TODO: Add invalidation keys for React Query
      // invalidateKeys: ['topics', `topic-${topic.id}`, `user-${userId}-topics`],
      // TODO: Add service messages for client display
      // messages: [{ type: 'success', message: 'Topic updated successfully' }],
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[updateTopic] catch', {
      error,
    });
    debugger; // eslint-disable-line no-debugger

    return {
      data: null,
      ok: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to update topic',
        details: { error: error instanceof Error ? error.message : String(error) },
      },
    };
  }
}
