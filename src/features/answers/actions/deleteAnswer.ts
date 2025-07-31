'use server';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { isDev } from '@/constants';
import { TAnswer } from '@/features/answers/types';

export async function deleteAnswer(answer: TAnswer) {
  // Check user rights to delete the answer...?
  const user = await getCurrentUser();
  const userId = user?.id;
  if (!userId) {
    throw new Error('Undefined user');
  }
  // Check user rights to delete the question...
  const question = await prisma.question.findUnique({
    where: { id: answer.questionId },
  });
  if (!question) {
    throw new Error('Not found owner question for the answer');
  }
  const topic = await prisma.topic.findUnique({
    where: { id: question.topicId },
  });
  if (!topic) {
    throw new Error('Not found owner topic for the deleting question');
  }
  // Check if the current user is allowed to delete the topic?
  if (userId !== topic?.userId && user.role !== 'ADMIN') {
    throw new Error('Current user not allowed to delete the question');
  }

  try {
    if (isDev) {
      // DEBUG: Emulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    // TODO: Check if the current user allowed to delete the question?
    const removedAnswer = await prisma.answer.delete({
      where: {
        id: answer.id,
      },
    });
    return removedAnswer;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[deleteAnswer] catch', {
      error,
    });
    debugger; // eslint-disable-line no-debugger
    throw error;
  }
}
