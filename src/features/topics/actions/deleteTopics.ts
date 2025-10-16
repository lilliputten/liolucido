'use server';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { isDev } from '@/constants';
import { TTopicId } from '@/features/topics/types';

export async function deleteTopics(topicIds: TTopicId[]) {
  // Check user rights to delete the topics
  const user = await getCurrentUser();
  const userId = user?.id;
  if (!userId) {
    throw new Error('Undefined user');
  }

  // Get all topics
  const topics = await prisma.topic.findMany({
    where: { id: { in: topicIds } },
  });

  if (topics.length !== topicIds.length) {
    throw new Error('Some topics not found');
  }

  // Check user rights for all topics
  for (const topic of topics) {
    if (userId !== topic.userId && user.role !== 'ADMIN') {
      throw new Error('Current user is not allowed to delete the topic');
    }
  }

  try {
    if (isDev) {
      // DEBUG: Emulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    const removedTopics = await prisma.topic.deleteMany({
      where: {
        id: { in: topicIds },
      },
    });

    return removedTopics;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[deleteTopics] catch', {
      error,
    });
    debugger; // eslint-disable-line no-debugger
    throw error;
  }
}
