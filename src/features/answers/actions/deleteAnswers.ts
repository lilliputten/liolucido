'use server';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { isDev } from '@/constants';
import { TAnswerId } from '@/features/answers/types';

export async function deleteAnswers(answerIds: TAnswerId[]) {
  // Check user rights to delete the answers
  const user = await getCurrentUser();
  const userId = user?.id;
  if (!userId) {
    throw new Error('Undefined user');
  }

  // Get all answers with their questions and topics
  const answers = await prisma.answer.findMany({
    where: { id: { in: answerIds } },
    include: { question: { include: { topic: true } } },
  });

  if (answers.length !== answerIds.length) {
    throw new Error('Some answers not found');
  }

  // Check user rights for all answers
  for (const answer of answers) {
    const topic = answer.question?.topic;
    if (!topic) {
      throw new Error('Not found owner topic for the deleting answer');
    }
    if (userId !== topic.userId && user.role !== 'ADMIN') {
      throw new Error('Current user is not allowed to delete the answer');
    }
  }

  try {
    if (isDev) {
      // DEBUG: Emulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    const removedAnswers = await prisma.answer.deleteMany({
      where: {
        id: { in: answerIds },
      },
    });

    return removedAnswers;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[deleteAnswers] catch', {
      error,
    });
    debugger; // eslint-disable-line no-debugger
    throw error;
  }
}
