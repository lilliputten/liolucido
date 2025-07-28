'use server';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { isDev } from '@/constants';
import { TOptionalTopic, TTopic } from '@/features/topics/types';

export async function updateTopic(topic: TTopic) {
  const user = await getCurrentUser();
  const userId = user?.id;
  try {
    if (isDev) {
      // DEBUG: Emulate network delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
    if (!userId) {
      throw new Error('Got undefined user');
    }
    if (!topic.name) {
      throw new Error('Not specified topic name');
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

    return updatedTopic as TTopic;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[updateTopic] catch', {
      error,
    });
    debugger; // eslint-disable-line no-debugger
    throw error;
  }
}
