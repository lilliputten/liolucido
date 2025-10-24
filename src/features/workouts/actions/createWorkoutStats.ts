'use server';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { WorkoutStatsSchema } from '@/generated/prisma';

type CreateWorkoutStatsData = Omit<typeof WorkoutStatsSchema._type, 'id' | 'userId' | 'createdAt'>;

export async function createWorkoutStats(data: CreateWorkoutStatsData) {
  const user = await getCurrentUser();
  if (!user?.id) {
    throw new Error('Authentication required');
  }

  const workoutStats = await prisma.workoutStats.create({
    data: {
      userId: user.id,
      ...data,
    },
  });

  return workoutStats;
}
