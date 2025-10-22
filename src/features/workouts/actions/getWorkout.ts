'use server';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { TTopicId } from '@/features/topics/types';

export async function getWorkout(topicId: TTopicId) {
  const user = await getCurrentUser();
  const userId = user?.id;
  if (!userId) {
    throw new Error('Authentication required');
  }

  const workout = await prisma.userTopicWorkout.findUnique({
    where: {
      userId_topicId: { userId, topicId },
    },
  });

  if (!workout) {
    return undefined;
  }

  return workout;
}
