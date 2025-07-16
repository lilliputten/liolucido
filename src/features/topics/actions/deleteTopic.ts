'use server';

import { prisma } from '@/lib/db';
import { isDev } from '@/constants';
import { TTopic } from '@/features/topics/types';

export async function deleteTopic(topic: TTopic) {
  try {
    if (isDev) {
      // DEBUG: Emulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    const topicId = topic.id;
    const removedTopic = await prisma.topic.delete({
      where: {
        id: topicId,
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
