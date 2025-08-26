'use server';

import { z } from 'zod';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { UserTopicWorkoutSchema } from '@/generated/prisma';

const updateWorkoutSchema = UserTopicWorkoutSchema.omit({
  userId: true,
  topicId: true,
  createdAt: true,
  updatedAt: true,
}).partial();

type UpdateWorkoutData = z.infer<typeof updateWorkoutSchema>;

export async function updateWorkout(topicId: string, data: UpdateWorkoutData) {
  const user = await getCurrentUser();
  if (!user?.id) {
    throw new Error('Authentication required');
  }

  const updateData = updateWorkoutSchema.parse(data);

  const workout = await prisma.userTopicWorkout.update({
    where: {
      userId_topicId: {
        userId: user.id,
        topicId,
      },
    },
    data: updateData,
  });

  return workout;
}
