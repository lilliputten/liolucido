'use server';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { isDev } from '@/constants';
import { TQuestion, TQuestionData } from '@/features/questions/types';

export async function updateQuestion(questionData: TQuestionData) {
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
  if (!questionData.text) {
    throw new Error('Not specified question text');
  }
  // Check user rights to delete the question...
  const question = await prisma.question.findUnique({
    where: { id: questionData.id },
    include: { topic: true },
  });
  if (!question) {
    throw new Error('Not found question to update');
  }
  const topic = question.topic;
  if (!topic) {
    throw new Error('Not found owner topic for the updating question');
  }
  // Check if the current user is allowed to update the topic?
  if (userId !== topic?.userId && user.role !== 'ADMIN') {
    throw new Error('Current user is not allowed to update the question');
  }
  try {
    const updatedQuestion = await prisma.question.update({
      where: { id: questionData.id },
      data: questionData,
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
