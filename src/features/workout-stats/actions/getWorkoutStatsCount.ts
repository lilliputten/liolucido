'use server';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';

export async function getWorkoutStatsCount(topicId: string) {
  const user = await getCurrentUser();
  if (!user?.id) {
    throw new Error('Authentication required');
  }

  const count = await prisma.workoutStats.count({
    where: {
      userId: user.id,
      topicId,
    },
  });

  return count;
}
