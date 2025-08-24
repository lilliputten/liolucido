'use server';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { isDev } from '@/constants';
import { TQuestionId } from '@/features/questions/types';

/* TODO: To broadcast a client message to refresh topics data, including other tabs? */

export async function deleteQuestion(questionId: TQuestionId) {
  // Check user rights to delete the question...?
  const user = await getCurrentUser();
  const userId = user?.id;
  if (!userId) {
    throw new Error('Undefined user');
  }
  // Check user rights to delete the question...
  const question = await prisma.question.findUnique({
    where: { id: questionId },
    include: { topic: true },
  });
  if (!question) {
    throw new Error('Not found question to delete');
  }
  const topic = question.topic;
  if (!topic) {
    throw new Error('Not found owner topic for the deleting question');
  }
  // Check if the current user is allowed to delete the topic?
  if (userId !== topic?.userId && user.role !== 'ADMIN') {
    throw new Error('Current user not allowed to delete the question');
  }
  try {
    if (isDev) {
      // DEBUG: Emulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    const removedQuestion = await prisma.$transaction(async (tx) => {
      // Update UserTopicWorkout before deleting the question
      const workouts = await tx.userTopicWorkout.findMany({
        where: { topicId: question.topicId },
      });

      // TODO: Use Promise.all to update all the affected workouts simultaneously
      for (const workout of workouts) {
        const questionsOrder = (workout.questionsOrder || '').split(' ');
        const questionResults = workout.questionResults ? JSON.parse(workout.questionResults) : [];
        const questionIndex = questionsOrder.indexOf(question.id);

        if (questionIndex !== -1) {
          // Remove question from order
          questionsOrder.splice(questionIndex, 1);

          // Remove corresponding result
          if (questionResults.length > questionIndex) {
            questionResults.splice(questionIndex, 1);
          }

          // Adjust stepIndex if needed
          let newStepIndex = workout.stepIndex || 0;
          if (questionIndex < newStepIndex) {
            newStepIndex = Math.max(0, newStepIndex - 1);
          }

          await tx.userTopicWorkout.update({
            where: {
              userId_topicId: {
                userId: workout.userId,
                topicId: workout.topicId,
              },
            },
            data: {
              questionsOrder: questionsOrder.join(' '),
              questionsCount: questionsOrder.length,
              questionResults: JSON.stringify(questionResults),
              stepIndex: newStepIndex,
            },
          });
        }
      }

      // TODO: Check if the current user allowed to delete the question?
      return await tx.question.delete({
        where: {
          id: question.id,
        },
      });
    });

    return removedQuestion;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[deleteQuestion] catch', {
      error,
    });
    debugger; // eslint-disable-line no-debugger
    throw error;
  }
}
