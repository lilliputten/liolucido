'use server';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';

export async function getWorkout(topicId: string) {
  const user = await getCurrentUser();
  if (!user?.id) {
    throw new Error('Authentication required');
  }

  const workout = await prisma.userTopicWorkout.findUnique({
    where: {
      userId_topicId: {
        userId: user.id,
        topicId,
      },
    },
  });

  if (!workout) {
    return null;
  }

  return workout;
}
