'use server';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { isDev } from '@/constants';
import { TQuestion } from '@/features/questions/types';

export async function deleteQuestion(question: TQuestion) {
  // Check user rights to delete the question...?
  const user = await getCurrentUser();
  const userId = user?.id;
  if (!userId) {
    throw new Error('Undefined user');
  }
  // Check user rights to delete the question...
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
    const removedQuestion = await prisma.question.delete({
      where: {
        id: question.id,
      },
    });
    return removedQuestion;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[deleteQuestion] catch', {
      error,
    });
    debugger; // eslint-disable-line no-debugger
    throw error;
  }
}
