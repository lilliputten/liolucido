'use server';

import { TApiResponse } from '@/shared/types/api';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { isDev } from '@/constants';
import { TNewAnswer } from '@/features/answers/types';

import { TAnswer } from '../types';

export async function addNewAnswer(newAnswer: TNewAnswer): Promise<TApiResponse<TAnswer>> {
  if (isDev) {
    // DEBUG: Emulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  const user = await getCurrentUser();
  const userId = user?.id;
  try {
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
    if (!newAnswer.text) {
      return {
        data: null,
        ok: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Answer text is required',
        },
      };
    }
    if (!newAnswer.questionId) {
      return {
        data: null,
        ok: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Question ID is required',
        },
      };
    }
    const question = await prisma.question.findUnique({
      where: { id: newAnswer.questionId },
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
          message: 'Not allowed to add answers to this topic',
        },
      };
    }

    const data = { ...newAnswer };
    const addedAnswer = await prisma.answer.create({
      data,
    });

    return {
      data: addedAnswer as TAnswer,
      ok: true,
      // TODO: Add invalidation keys for React Query
      // invalidateKeys: ['answers', `question-${newAnswer.questionId}-answers`],
      // TODO: Add service messages for client display
      // messages: [{ type: 'success', message: 'Answer created successfully' }],
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[addNewAnswer] catch', {
      error,
    });
    debugger; // eslint-disable-line no-debugger

    return {
      data: null,
      ok: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to create answer',
        details: { error: error instanceof Error ? error.message : String(error) },
      },
    };
  }
}
