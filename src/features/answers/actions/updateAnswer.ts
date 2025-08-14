'use server';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { isDev } from '@/constants';
import { TAnswer } from '@/features/answers/types';

/** Update the whole answer data */
export async function updateAnswer(answer: TAnswer) {
  if (isDev) {
    // DEBUG: Emulate network delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  // Check user rights to delete the answer...?
  const user = await getCurrentUser();
  const userId = user?.id;
  if (!userId) {
    throw new Error('Undefined user');
  }
  try {
    if (!answer.text) {
      throw new Error('Not specified answer text');
    }
    // Check user rights to delete the question...
    const question = await prisma.question.findUnique({
      where: { id: answer.questionId },
    });
    if (!question) {
      throw new Error('Not found owner question for the deleting question');
    }
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
    const updatedAnswer = await prisma.answer.update({
      where: { id: answer.id },
      data: answer,
    });
    return updatedAnswer as TAnswer;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[updateAnswer] catch', {
      error,
      answer,
    });
    debugger; // eslint-disable-line no-debugger
    throw error;
  }
}
