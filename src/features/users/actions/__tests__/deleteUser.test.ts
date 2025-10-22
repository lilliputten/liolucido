import { User } from '@prisma/client';

import { jestPrisma } from '@/lib/db/jestPrisma';
import { TTopicId } from '@/features/topics/types';
import { TUserId } from '@/features/users/types/TUser';

import { deleteUser } from '../deleteUser';

test('should delete the user and all the related topics (as cascaded)', async () => {
  const userIds: TUserId[] = [];
  const topicIds: TTopicId[] = [];
  try {
    // Create users...
    const user1: User = await jestPrisma.user.create({
      data: { name: 'User for deleteUser.test' },
    });
    const userId = user1.id;
    userIds.push(userId);
    // Create parent records...
    const firstTopic = await jestPrisma.topic.create({
      data: { name: 'Test topic for user ' + userId, userId },
    });
    topicIds.push(firstTopic.id);
    // Delete user...
    const deletedUser = await deleteUser(userId);
    expect(deletedUser).not.toBeUndefined();
    // Try to get (removed) user' topics
    const emptyArray = await jestPrisma.topic.findMany({
      where: { userId },
    });
    expect(emptyArray.length).toEqual(0);
  } finally {
    // Clean up...
    await jestPrisma.topic.deleteMany({ where: { id: { in: topicIds } } });
    await jestPrisma.user.deleteMany({ where: { id: { in: userIds } } });
  }
});
