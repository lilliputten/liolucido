'use server';

import { TApiResponse } from '@/shared/types/api';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { isDev } from '@/constants';
import { TAnswer } from '@/features/answers/types';

/** Update the whole answer data */
export async function updateAnswer(answer: TAnswer): Promise<TApiResponse<TAnswer>> {
  if (isDev) {
    // DEBUG: Emulate network delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
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
  try {
    if (!answer.text) {
      return {
        data: null,
        ok: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Answer text is required',
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
    // Check if the current user is allowed to update the topic?
    if (userId !== topic?.userId && user.role !== 'ADMIN') {
      return {
        data: null,
        ok: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Not allowed to update this answer',
        },
      };
    }
    const updatedAnswer = await prisma.answer.update({
      where: { id: answer.id },
      data: answer,
    });

    return {
      data: updatedAnswer as TAnswer,
      ok: true,
      // TODO: Add invalidation keys for React Query
      // invalidateKeys: ['answers', `question-${answer.questionId}-answers`, `answer-${answer.id}`],
      // TODO: Add service messages for client display
      // messages: [{ type: 'success', message: 'Answer updated successfully' }],
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[updateAnswer] catch', {
      error,
      answer,
    });
    debugger; // eslint-disable-line no-debugger

    return {
      data: null,
      ok: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to update answer',
        details: { error: error instanceof Error ? error.message : String(error) },
      },
    };
  }
}
