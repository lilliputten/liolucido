'use server';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { TTopicId } from '@/features/topics/types';

export async function getAvailableQuestionsIdsForTopicId(topicId: TTopicId) {
  const user = await getCurrentUser();
  const userId = user?.id;
  const isAdmin = user?.role === 'ADMIN';

  const where = {
    topicId,
    topic: !userId
      ? { isPublic: true }
      : !isAdmin
        ? { OR: [{ userId }, { isPublic: true }] }
        : undefined,
  };

  const questions = await prisma.question.findMany({
    where,
    select: {
      id: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  return questions.map((q) => q.id);
}
