'use server';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';

export async function getWorkoutStatsHistory(topicId: string) {
  const user = await getCurrentUser();
  if (!user?.id) {
    throw new Error('Authentication required');
  }

  const workoutStats = await prisma.workoutStats.findMany({
    where: {
      userId: user.id,
      topicId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return workoutStats;
}

