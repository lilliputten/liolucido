'use server';

import { Prisma } from '@prisma/client';

import { prisma } from '@/lib/db';
import { TGetAvailableAnswerByIdParams } from '@/lib/zod-schemas';
import { isDev } from '@/constants';

import { IncludedQuestionSelect, TAvailableAnswer } from '../types';

interface TOptions {
  noDebug?: boolean;
}

/** @return Promise<TAvailableAnswer> */
export async function getAvailableAnswerById(params: TGetAvailableAnswerByIdParams & TOptions) {
  const {
    id,
    // AnswerIncludeParamsSchema
    includeQuestion = false,
    // Options (no error console output and debugger stops, for tests)
    noDebug,
  } = params;
  /* // TODO: Check user rights to access the answer?
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
    const include: Prisma.AnswerInclude = {
      // _count: { select: { answers: includeAnswersCount } },
    };
    if (includeQuestion) {
      include.question = { select: IncludedQuestionSelect };
    }
    // Create the "where" data...
    const where: Prisma.AnswerWhereUniqueInput = {
      id,
      /* // TODO: Restrict isPublic if it isn't an admin user?
       * isPublic: isAdmin ? null : false,
       */
    };
    // Combine all the request arguments...
    const answer = await prisma.answer.findUnique({
      where,
      include,
    });

    if (!answer) {
      throw new Error('No answer found');
    }

    /* // TODO: Check if this answer is allowed for the user?
     * const question = prisma.question.findUnique({ where: { id: answer.questionId } });
     * // Check if the current user is allowed to see the answer?
     * if (!question.isPublic && userId !== question?.userId && user?.role !== 'ADMIN') {
     *   throw new Error('Current user is not allowed to access the answer');
     * }
     */

    return answer satisfies TAvailableAnswer;
  } catch (error) {
    if (!noDebug) {
      // eslint-disable-next-line no-console
      console.error('[getAvailableAnswerById] catch', {
        error,
      });
      debugger; // eslint-disable-line no-debugger
    }
    throw error;
  }
}
