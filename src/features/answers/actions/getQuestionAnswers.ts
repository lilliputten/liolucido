'use server';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { isDev } from '@/constants';
import { TQuestionId } from '@/features/questions/types';

import { TAnswer } from '../types';

export async function getQuestionAnswers(questionId: TQuestionId) {
  // Check user rights to delete the answer...?
  const user = await getCurrentUser();
  const userId = user?.id;
  try {
    // Check user rights to delete the answer...
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });
    if (!question) {
      throw new Error(`Not found owner question (${questionId}).`);
    }
    const topic = await prisma.topic.findUnique({
      where: { id: question.topicId },
    });
    if (!topic) {
      throw new Error('Not found owner topic for the answer');
    }
    if (!topic.isPublic && userId !== topic?.userId && user?.role !== 'ADMIN') {
      throw new Error('Current user is not allowed to access the topic answers');
    }

    if (isDev) {
      // DEBUG: Emulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    const answers: TAnswer[] = await prisma.answer.findMany({
      where: { questionId },
    });
    return answers;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[getQuestionAnswers] catch', {
      error,
    });
    debugger; // eslint-disable-line no-debugger
    throw error;
  }
}
