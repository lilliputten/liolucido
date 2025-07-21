'use server';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { isDev } from '@/constants';
import { TQuestion } from '@/features/questions/types';

export async function updateQuestion(question: TQuestion) {
  if (isDev) {
    // DEBUG: Emulate network delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  // Check user rights to delete the question...?
  const user = await getCurrentUser();
  const userId = user?.id;
  if (!userId) {
    throw new Error('Undefined user');
  }
  if (!question.text) {
    throw new Error('Not specified question text');
  }
  // Check user rights to delete the question...
  const topic = await prisma.topic.findUnique({
    where: { id: question.topicId },
  });
  if (!topic) {
    throw new Error('Not found owner topic for the deleting question');
  }
  // Check if the current user is allowed to update the topic?
  if (userId !== topic?.userId && user.role !== 'ADMIN') {
    throw new Error('Current user is not allowed to delete the question');
  }
  try {
    const updatedQuestion = await prisma.question.update({
      where: { id: question.id },
      data: question,
    });
    return updatedQuestion as TQuestion;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[updateQuestion] catch', {
      error,
    });
    debugger; // eslint-disable-line no-debugger
    throw error;
  }
}
