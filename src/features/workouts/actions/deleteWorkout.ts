'use server';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';

export async function deleteWorkout(topicId: string) {
  const user = await getCurrentUser();
  if (!user?.id) {
    throw new Error('Authentication required');
  }

  await prisma.userTopicWorkout.delete({
    where: {
      userId_topicId: {
        userId: user.id,
        topicId,
      },
    },
  });

  return { success: true };
}
