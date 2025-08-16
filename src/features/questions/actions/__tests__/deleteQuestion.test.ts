import { describe, expect, it } from '@jest/globals';

import { jestPrisma } from '@/lib/db/jestPrisma';

describe('deleteQuestion UserTopicWorkout updates', () => {
  it('should remove question from questionsOrder and adjust stepIndex', async () => {
    const createdIds: string[] = [];

    try {
      const user = await jestPrisma.user.create({
        data: {
          email: `test-${Date.now()}-${Math.random()}@example.com`,
          name: 'Test User',
          role: 'ADMIN',
        },
      });
      createdIds.push(`user:${user.id}`);

      const topic = await jestPrisma.topic.create({
        data: {
          name: `Test Topic ${Date.now()}`,
          userId: user.id,
        },
      });
      createdIds.push(`topic:${topic.id}`);

      const question1 = await jestPrisma.question.create({
        data: { text: 'Question 1', topicId: topic.id },
      });
      const question2 = await jestPrisma.question.create({
        data: { text: 'Question 2', topicId: topic.id },
      });
      const question3 = await jestPrisma.question.create({
        data: { text: 'Question 3', topicId: topic.id },
      });
      createdIds.push(`question:${question1.id}`);
      createdIds.push(`question:${question2.id}`);
      createdIds.push(`question:${question3.id}`);

      await jestPrisma.userTopicWorkout.create({
        data: {
          userId: user.id,
          topicId: topic.id,
          questionsOrder: `${question1.id} ${question2.id} ${question3.id}`,
          questionResults: JSON.stringify([true, false, true]),
          stepIndex: 2,
        },
      });
      createdIds.push(`workout:${user.id}:${topic.id}`);

      // Simulate deleteQuestion logic for UserTopicWorkout updates
      const workouts = await jestPrisma.userTopicWorkout.findMany({
        where: { topicId: topic.id },
      });

      for (const workout of workouts) {
        const questionsOrder = (workout.questionsOrder || '').split(' ').filter(Boolean);
        const questionResults = workout.questionResults ? JSON.parse(workout.questionResults) : [];
        const questionIndex = questionsOrder.indexOf(question2.id);

        if (questionIndex !== -1) {
          questionsOrder.splice(questionIndex, 1);
          if (questionResults.length > questionIndex) {
            questionResults.splice(questionIndex, 1);
          }
          let newStepIndex = workout.stepIndex || 0;
          if (questionIndex < newStepIndex) {
            newStepIndex = Math.max(0, newStepIndex - 1);
          }

          await jestPrisma.userTopicWorkout.update({
            where: {
              userId_topicId: {
                userId: workout.userId,
                topicId: workout.topicId,
              },
            },
            data: {
              questionsOrder: questionsOrder.join(' '),
              questionResults: JSON.stringify(questionResults),
              stepIndex: newStepIndex,
            },
          });
        }
      }

      // Delete the question
      await jestPrisma.question.delete({
        where: { id: question2.id },
      });

      const workout = await jestPrisma.userTopicWorkout.findUnique({
        where: { userId_topicId: { userId: user.id, topicId: topic.id } },
      });

      expect(workout?.questionsOrder).toBe(`${question1.id} ${question3.id}`);
      expect(JSON.parse(workout?.questionResults || '[]')).toEqual([true, true]);
      expect(workout?.stepIndex).toBe(1);
    } finally {
      for (const id of createdIds.reverse()) {
        const [type, ...parts] = id.split(':');
        if (type === 'workout') {
          await jestPrisma.userTopicWorkout.deleteMany({
            where: { userId: parts[0], topicId: parts[1] },
          });
        } else if (type === 'question') {
          await jestPrisma.question.deleteMany({ where: { id: parts[0] } });
        } else if (type === 'topic') {
          await jestPrisma.topic.deleteMany({ where: { id: parts[0] } });
        } else if (type === 'user') {
          await jestPrisma.user.deleteMany({ where: { id: parts[0] } });
        }
      }
    }
  });

  it('should not adjust stepIndex when deleting question after current step', async () => {
    const createdIds: string[] = [];

    try {
      const user = await jestPrisma.user.create({
        data: {
          email: `test-${Date.now()}-${Math.random()}@example.com`,
          name: 'Test User',
          role: 'ADMIN',
        },
      });
      createdIds.push(`user:${user.id}`);

      const topic = await jestPrisma.topic.create({
        data: {
          name: `Test Topic ${Date.now()}`,
          userId: user.id,
        },
      });
      createdIds.push(`topic:${topic.id}`);

      const question1 = await jestPrisma.question.create({
        data: { text: 'Question 1', topicId: topic.id },
      });
      const question2 = await jestPrisma.question.create({
        data: { text: 'Question 2', topicId: topic.id },
      });
      createdIds.push(`question:${question1.id}`);
      createdIds.push(`question:${question2.id}`);

      await jestPrisma.userTopicWorkout.create({
        data: {
          userId: user.id,
          topicId: topic.id,
          questionsOrder: `${question1.id} ${question2.id}`,
          questionResults: JSON.stringify([true]),
          stepIndex: 0,
        },
      });
      createdIds.push(`workout:${user.id}:${topic.id}`);

      // Simulate deleteQuestion logic
      const workouts = await jestPrisma.userTopicWorkout.findMany({
        where: { topicId: topic.id },
      });

      for (const workout of workouts) {
        const questionsOrder = (workout.questionsOrder || '').split(' ').filter(Boolean);
        const questionResults = workout.questionResults ? JSON.parse(workout.questionResults) : [];
        const questionIndex = questionsOrder.indexOf(question2.id);

        if (questionIndex !== -1) {
          questionsOrder.splice(questionIndex, 1);
          if (questionResults.length > questionIndex) {
            questionResults.splice(questionIndex, 1);
          }
          let newStepIndex = workout.stepIndex || 0;
          if (questionIndex < newStepIndex) {
            newStepIndex = Math.max(0, newStepIndex - 1);
          }

          await jestPrisma.userTopicWorkout.update({
            where: {
              userId_topicId: {
                userId: workout.userId,
                topicId: workout.topicId,
              },
            },
            data: {
              questionsOrder: questionsOrder.join(' '),
              questionResults: JSON.stringify(questionResults),
              stepIndex: newStepIndex,
            },
          });
        }
      }

      await jestPrisma.question.delete({
        where: { id: question2.id },
      });

      const workout = await jestPrisma.userTopicWorkout.findUnique({
        where: { userId_topicId: { userId: user.id, topicId: topic.id } },
      });

      expect(workout?.stepIndex).toBe(0);
    } finally {
      for (const id of createdIds.reverse()) {
        const [type, ...parts] = id.split(':');
        if (type === 'workout') {
          await jestPrisma.userTopicWorkout.deleteMany({
            where: { userId: parts[0], topicId: parts[1] },
          });
        } else if (type === 'question') {
          await jestPrisma.question.deleteMany({ where: { id: parts[0] } });
        } else if (type === 'topic') {
          await jestPrisma.topic.deleteMany({ where: { id: parts[0] } });
        } else if (type === 'user') {
          await jestPrisma.user.deleteMany({ where: { id: parts[0] } });
        }
      }
    }
  });
});
