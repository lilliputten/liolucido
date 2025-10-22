'use server';

import { prisma } from '@/lib/db';
import { isDev } from '@/constants';
import { TNewQuestion } from '@/features/questions/types';

import { TQuestion } from '../types';

/* TODO: To broadcast a client message to refresh topics data, including other tabs? */

/* TODO: Use the same parameters for "include" data, as in `getAvailableQuestionById`, see `IncludedTopicSelect` */

export async function addNewQuestion(newQuestion: TNewQuestion) {
  try {
    if (isDev) {
      // DEBUG: Emulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    /* // TODO: Check user rights to modify topic?
     * const user = await getCurrentUser();
     * const userId = user?.id;
     * if (!userId) {
     *   throw new Error('Got undefined user');
     * }
     */
    if (!newQuestion.text) {
      throw new Error('Not specified question name');
    }
    const result = await prisma.$transaction(async (tx) => {
      const { answers, ...questionFields } = newQuestion;
      const addedQuestion = await tx.question.create({
        data: {
          ...questionFields,
          ...(answers?.length && {
            answers: {
              create: answers.map((answer) => ({
                ...answer,
                isGenerated: questionFields.isGenerated || false,
              })),
            },
          }),
        },
      });

      // Update UserTopicWorkout questionsOrder for all users with this topic
      const workouts = await tx.userTopicWorkout.findMany({
        where: { topicId: newQuestion.topicId },
      });

      // TODO: Use Promise.all to update all the affected workouts simultaneously
      for (const workout of workouts) {
        const currentOrder = workout.questionsOrder || '';
        const newOrder = currentOrder ? `${currentOrder} ${addedQuestion.id}` : addedQuestion.id;

        await tx.userTopicWorkout.update({
          where: {
            userId_topicId: {
              userId: workout.userId,
              topicId: workout.topicId,
            },
          },
          data: {
            questionsCount: (workout.questionsCount || 0) + 1,
            questionsOrder: newOrder,
          },
        });
      }

      return addedQuestion;
    });

    return result as TQuestion;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[addNewQuestion] catch', {
      error,
    });
    debugger; // eslint-disable-line no-debugger
    throw error;
  }
}
