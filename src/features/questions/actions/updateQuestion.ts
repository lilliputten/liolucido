'use server';

import { TApiResponse } from '@/shared/types/api';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { isDev } from '@/constants';
import { TQuestion, TQuestionData } from '@/features/questions/types';

export async function updateQuestion(question: TQuestionData): Promise<TApiResponse<TQuestion>> {
  if (isDev) {
    // DEBUG: Emulate network delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  // Check user rights to delete the question...?
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
  if (!question.text) {
    return {
      data: null,
      ok: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Question text is required',
      },
    };
  }
  // Check user rights to delete the question...
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
        message: 'Not allowed to update this question',
      },
    };
  }
  try {
    const updatedQuestion = await prisma.question.update({
      where: { id: question.id },
      data: question,
    });

    return {
      data: updatedQuestion as TQuestion,
      ok: true,
      // TODO: Add invalidation keys for React Query
      // invalidateKeys: ['questions', `topic-${question.topicId}-questions`, `question-${question.id}`],
      // TODO: Add service messages for client display
      // messages: [{ type: 'success', message: 'Question updated successfully' }],
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[updateQuestion] catch', {
      error,
    });
    debugger; // eslint-disable-line no-debugger

    return {
      data: null,
      ok: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to update question',
        details: { error: error instanceof Error ? error.message : String(error) },
      },
    };
  }
}
