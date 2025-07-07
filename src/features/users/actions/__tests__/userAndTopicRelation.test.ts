import { Topic, User, UserTopic } from '@prisma/client';

import { prisma } from '@/lib/db';
import { getErrorText } from '@/lib/helpers/strings';

test('should create relation and remove it if topic removed', async () => {
  const users: User[] = [];
  const topics: Topic[] = [];
  const userTopics: UserTopic[] = [];
  try {
    // Create users...
    const user1: User = await prisma.user.create({
      data: { name: 'User for userAndTopicRelation.test' },
    });
    const userId = user1.id;
    users.push(user1);
    // Create parent records...
    const topic1 = await prisma.topic.create({
      data: { name: 'Test topic 1 for user ' + userId, userId },
    });
    topics.push(topic1);
    // Create a user-topic relation record
    const userTopic1 = await prisma.userTopic.create({
      data: { userId, topicId: topic1.id, favorite: true },
    });
    userTopics.push(userTopic1);
    /* // EXAMPLE: Remove user's topic directly
     * const removedUserTopic = await prisma.userTopic.delete({
     *   where: {
     *     userId_topicId: {
     *       userId,
     *       topicId,
     *     },
     *   },
     * });
     */
    // Remove topic
    await prisma.topic.delete({
      where: {
        id: topic1.id,
      },
    });
    // Find user's topics again
    const foundUserTopics = await prisma.userTopic.findMany({
      where: { userId },
    });
    // Should find nothing
    expect(foundUserTopics.length).toBe(0);
  } catch (error) {
    const nextText = 'Test error';
    const errorMessage = getErrorText(error);
    const nextMessage = [nextText, errorMessage].filter(Boolean).join(': ');
    const nextError = new Error(nextMessage);
    // eslint-disable-next-line no-console
    console.error('[userAndTopicRelation.test]', nextMessage, {
      nextError,
      errorMessage,
      error,
    });
    debugger; // eslint-disable-line no-debugger
    // NOTE: Re-throw the error
    throw nextError;
  } finally {
    // Clean up...
    await prisma.userTopic.deleteMany({
      where: {
        OR: userTopics.map(({ userId, topicId }) => ({
          AND: [{ userId }, { topicId }],
        })),
      },
    });
    await prisma.topic.deleteMany({ where: { id: { in: topics.map(({ id }) => id) } } });
    await prisma.user.deleteMany({ where: { id: { in: users.map(({ id }) => id) } } });
  }
});
