'use server';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { isDev } from '@/constants';
import { TTopic } from '@/features/topics/types';

export async function deleteTopic(topic: TTopic) {
  // Check user rights to delete the question...?
  const user = await getCurrentUser();
  const userId = user?.id;
  if (!userId) {
    throw new Error('Undefined user');
  }
  // Check user rights to delete the question...
  if (userId !== topic.userId || user.role !== 'ADMIN') {
    throw new Error('Current user not allowed to delete the topic');
  }
  try {
    if (isDev) {
      // DEBUG: Emulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    const removedTopic = await prisma.topic.delete({
      where: {
        id: topic.id,
      },
    });
    return removedTopic;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[deleteTopic] catch', {
      error,
    });
    debugger; // eslint-disable-line no-debugger
    throw error;
  }
}
