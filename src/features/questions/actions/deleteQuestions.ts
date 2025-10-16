'use server';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { isDev } from '@/constants';
import { TQuestionId } from '@/features/questions/types';

export async function deleteQuestions(questionIds: TQuestionId[]) {
  // Check user rights to delete the questions
  const user = await getCurrentUser();
  const userId = user?.id;
  if (!userId) {
    throw new Error('Undefined user');
  }

  // Get all questions with their topics
  const questions = await prisma.question.findMany({
    where: { id: { in: questionIds } },
    include: { topic: true },
  });

  if (questions.length !== questionIds.length) {
    throw new Error('Some questions not found');
  }

  // Check user rights for all questions
  for (const question of questions) {
    const topic = question.topic;
    if (!topic) {
      throw new Error('Not found owner topic for the deleting question');
    }
    if (userId !== topic.userId && user.role !== 'ADMIN') {
      throw new Error('Current user is not allowed to delete the question');
    }
  }

  try {
    if (isDev) {
      // DEBUG: Emulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    const removedQuestions = await prisma.question.deleteMany({
      where: {
        id: { in: questionIds },
      },
    });

    return removedQuestions;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[deleteQuestions] catch', {
      error,
    });
    debugger; // eslint-disable-line no-debugger
    throw error;
  }
}
