'use server';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';

import { TAvailableQuestion, TNewQuestion } from '../types';

export async function addMultipleQuestions(
  newQuestions: TNewQuestion[],
): Promise<TAvailableQuestion[]> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Undefined user');
  }

  if (!newQuestions.length) {
    return [];
  }

  // Verify user has access to the topic
  const topicId = newQuestions[0].topicId;
  const topic = await prisma.topic.findFirst({
    where: {
      id: topicId,
      OR: [{ userId: user.id }, { isPublic: true }],
    },
  });

  if (!topic) {
    throw new Error('Topic not found or access denied');
  }

  if (topic.userId !== user.id && user.role !== 'ADMIN') {
    throw new Error('Current user is not allowed to add questions to this topic');
  }

  const createdQuestions = await prisma.$transaction(
    newQuestions.map((questionData) => {
      const { answers, ...questionFields } = questionData;
      return prisma.question.create({
        data: {
          ...questionFields,
          ...(answers?.length && {
            answers: {
              create: answers.map((answer) => ({
                ...answer,
                isGenerated: questionFields.isGenerated || false,
              })),
            },
          }),
        },
        include: {
          _count: {
            select: { answers: true },
          },
        },
      });
    }),
  );

  return createdQuestions;
}
