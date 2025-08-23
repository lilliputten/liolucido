'use server';

import { Prisma } from '@prisma/client';

import { prisma } from '@/lib/db';
import { TGetAvailableQuestionByIdParams } from '@/lib/zod-schemes';
import { isDev } from '@/constants';

import { IncludedTopicSelect, TAvailableQuestion } from '../types';

interface TOptions {
  noDebug?: boolean;
}

/** @return Promise<TAvailableQuestion> */
export async function getAvailableQuestionById(params: TGetAvailableQuestionByIdParams & TOptions) {
  const {
    id,
    // QuestionIncludeParamsSchema
    includeTopic = false,
    includeAnswersCount = true,
    // Options (no error console output and debugger stops, for tests)
    noDebug,
  } = params;
  /* // TODO: Check user rights to access the question?
   * const user = await getCurrentUser();
   * const userId = user?.id;
   * const isAdmin = user?.role === 'ADMIN';
   */
  try {
    if (isDev) {
      // DEBUG: Emulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    // Create the "include" data...
    const include: Prisma.QuestionInclude = {
      _count: { select: { answers: includeAnswersCount } },
    };
    if (includeTopic) {
      include.topic = { select: IncludedTopicSelect };
    }
    // Create the "where" data...
    const where: Prisma.QuestionWhereUniqueInput = {
      id,
      /* // TODO: Restrict isPublic if it isn't an admin user?
       * isPublic: isAdmin ? null : false,
       */
    };
    // Combine all the request arguments...
    const question = await prisma.question.findUnique({
      where,
      include,
    });

    if (!question) {
      throw new Error('No question found');
    }

    /* // TODO: Check if this question is allowed for the user?
     * const topic = prisma.topic.findUnique({ where: { id: question.topicId } });
     * // Check if the current user is allowed to see the question?
     * if (!topic.isPublic && userId !== topic?.userId && user?.role !== 'ADMIN') {
     *   throw new Error('Current user is not allowed to access the question');
     * }
     */

    return question satisfies TAvailableQuestion;
  } catch (error) {
    if (!noDebug) {
      // eslint-disable-next-line no-console
      console.error('[getAvailableQuestionById] catch', {
        error,
      });
      debugger; // eslint-disable-line no-debugger
    }
    throw error;
  }
}
