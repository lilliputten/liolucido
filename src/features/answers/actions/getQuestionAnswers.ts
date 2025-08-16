'use server';

import { TApiResponse } from '@/shared/types/api';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { isDev } from '@/constants';
import { TQuestionId } from '@/features/questions/types';

import { TAnswer } from '../types';

export async function getQuestionAnswers(
  questionId: TQuestionId,
): Promise<TApiResponse<TAnswer[]>> {
  // Check user rights to delete the answer...?
  const user = await getCurrentUser();
  const userId = user?.id;
  try {
    // Check user rights to delete the answer...
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });
    if (!question) {
      return {
        data: null,
        ok: false,
        error: {
          code: 'NOT_FOUND',
          message: `Question not found (${questionId})`,
        },
      };
    }
    const topic = await prisma.topic.findUnique({
      where: { id: question.topicId },
    });
    if (!topic) {
      return {
        data: null,
        ok: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Topic not found',
        },
      };
    }
    if (!topic.isPublic && userId !== topic?.userId && user?.role !== 'ADMIN') {
      return {
        data: null,
        ok: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Not allowed to access these answers',
        },
      };
    }

    if (isDev) {
      // DEBUG: Emulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    const answers: TAnswer[] = await prisma.answer.findMany({
      where: { questionId },
    });

    return {
      data: answers,
      ok: true,
      // TODO: Add invalidation keys for React Query
      // invalidateKeys: [`question-${questionId}-answers`],
      // TODO: Add service messages for client display
      // messages: [{ type: 'info', message: `Loaded ${answers.length} answers` }],
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[getQuestionAnswers] catch', {
      error,
    });
    debugger; // eslint-disable-line no-debugger

    return {
      data: null,
      ok: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch answers',
        details: { error: error instanceof Error ? error.message : String(error) },
      },
    };
  }
}
