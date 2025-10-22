'use server';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { isDev } from '@/constants';
import { TNewAnswer } from '@/features/answers/types';

import { TAnswer } from '../types';

export async function addMultipleAnswers(newAnswers: TNewAnswer[]) {
  if (isDev) {
    // DEBUG: Emulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  const user = await getCurrentUser();
  const userId = user?.id;
  try {
    if (!userId) {
      throw new Error('Undefined user');
    }
    if (!newAnswers.length) {
      throw new Error('No answers provided');
    }

    // Validate all answers
    for (const newAnswer of newAnswers) {
      if (!newAnswer.text) {
        throw new Error('Not specified answer text');
      }
      if (!newAnswer.questionId) {
        throw new Error('Not specified answers owner question');
      }
    }

    return await prisma.$transaction(async (tx) => {
      // Get unique question IDs
      const questionIds = Array.from(new Set(newAnswers.map((answer) => answer.questionId)));

      // Verify all questions exist and user has permission
      const questions = await tx.question.findMany({
        where: { id: { in: questionIds } },
        include: { topic: true },
      });

      if (questions.length !== questionIds.length) {
        throw new Error('One or more questions not found');
      }

      // Check permissions for all topics
      for (const question of questions) {
        if (!question.topic) {
          throw new Error('Not found owner topic for the question');
        }
        if (userId !== question.topic.userId && user.role !== 'ADMIN') {
          throw new Error('Current user is not allowed to add answers to this question');
        }
      }

      const addedAnswers = await tx.answer.createMany({
        data: newAnswers,
      });

      // Return the created answers
      const createdAnswers = await tx.answer.findMany({
        where: {
          questionId: { in: questionIds },
          text: { in: newAnswers.map((a) => a.text) },
        },
        orderBy: { createdAt: 'desc' },
        take: addedAnswers.count,
      });

      return createdAnswers as TAnswer[];
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[addMultipleAnswers] catch', {
      error,
    });
    debugger; // eslint-disable-line no-debugger
    throw error;
  }
}
