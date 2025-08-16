'use server';

import { TApiResponse } from '@/shared/types/api';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { isDev } from '@/constants';
import { TAnswer } from '@/features/answers/types';

export async function deleteAnswer(answer: TAnswer): Promise<TApiResponse<TAnswer>> {
  // Check user rights to delete the answer...?
  const user = await getCurrentUser();
  const userId = user?.id;
  if (!userId) {
    return {
      data: null,
      ok: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      },
    };
  }
  // Check user rights to delete the question...
  const question = await prisma.question.findUnique({
    where: { id: answer.questionId },
  });
  if (!question) {
    return {
      data: null,
      ok: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Question not found',
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
  // Check if the current user is allowed to delete the topic?
  if (userId !== topic?.userId && user.role !== 'ADMIN') {
    return {
      data: null,
      ok: false,
      error: {
        code: 'FORBIDDEN',
        message: 'Not allowed to delete this answer',
      },
    };
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

    return {
      data: removedAnswer,
      ok: true,
      // TODO: Add invalidation keys for React Query
      // invalidateKeys: ['answers', `question-${answer.questionId}-answers`],
      // TODO: Add service messages for client display
      // messages: [{ type: 'success', message: 'Answer deleted successfully' }],
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[deleteAnswer] catch', {
      error,
    });
    debugger; // eslint-disable-line no-debugger

    return {
      data: null,
      ok: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to delete answer',
        details: { error: error instanceof Error ? error.message : String(error) },
      },
    };
  }
}
