'use server';

import { Prisma } from '@prisma/client';

import { TApiResponse } from '@/shared/types/api';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { isDev } from '@/constants';
import { TTopicId } from '@/features/topics/types';

import { TQuestion } from '../types';

export async function getTopicQuestions(topicId: TTopicId): Promise<TApiResponse<TQuestion[]>> {
  if (isDev) {
    // DEBUG: Emulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  // Check user rights to delete the question...?
  const user = await getCurrentUser();
  const userId = user?.id;
  // Check user rights to delete the question...
  const topic = await prisma.topic.findUnique({
    where: { id: topicId },
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
        message: 'Not allowed to access these questions',
      },
    };
  }
  try {
    const include: Prisma.QuestionInclude = {
      _count: { select: { answers: true } },
    };
    const questions: TQuestion[] = await prisma.question.findMany({
      where: { topicId },
      include,
    });

    return {
      data: questions,
      ok: true,
      // TODO: Add invalidation keys for React Query
      // invalidateKeys: [`topic-${topicId}-questions`],
      // TODO: Add service messages for client display
      // messages: [{ type: 'info', message: `Loaded ${questions.length} questions` }],
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[getTopicQuestions] catch', {
      error,
    });
    debugger; // eslint-disable-line no-debugger

    return {
      data: null,
      ok: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch questions',
        details: { error: error instanceof Error ? error.message : String(error) },
      },
    };
  }
}
