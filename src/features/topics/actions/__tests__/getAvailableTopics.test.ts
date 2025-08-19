import { ExtendedUser } from '@/@types/next-auth';
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { User } from '@prisma/client';

import { jestPrisma } from '@/lib/db/jestPrisma';
import { formatDateTag } from '@/lib/helpers/dates';
import { getCurrentUser } from '@/lib/session';
import { dayMs } from '@/constants';

// import { TExtendedUser } from '@/features/users/types/TUser';

import { getAvailableTopics } from '../getAvailableTopics';

type TExtendedUser = ExtendedUser;
// type TExtendedUser = {
//   // @see src/@types/next-auth.d.ts
//   role: UserRole;
//   // provider?: string; // XXX: In addition to Account?
//   // providerAccountId?: string; // XXX: In addition to Account?
// } & User;

const mockedGetCurrentUser = getCurrentUser as jest.MockedFunction<typeof getCurrentUser>;

type CreatedId =
  | { type: 'user'; id: string }
  | { type: 'topic'; id: string }
  | { type: 'question'; id: string }
  | { type: 'workout'; userId: string; topicId: string };

const cleanupDb = async (ids: CreatedId[]) => {
  for (const created of ids.reverse()) {
    if (created.type === 'workout') {
      await jestPrisma.userTopicWorkout.deleteMany({
        where: { userId: created.userId, topicId: created.topicId },
      });
    } else if (created.type === 'question') {
      await jestPrisma.question.deleteMany({ where: { id: created.id } });
    } else if (created.type === 'topic') {
      await jestPrisma.topic.deleteMany({ where: { id: created.id } });
    } else if (created.type === 'user') {
      await jestPrisma.user.deleteMany({ where: { id: created.id } });
    }
  }
};

describe('getAvailableTopics', () => {
  afterEach(() => {
    mockedGetCurrentUser.mockReset();
  });

  it('should return only public topics for an unauthorized user', async () => {
    const dateTag = formatDateTag();
    const createdIds: CreatedId[] = [];
    try {
      const user = await jestPrisma.user.create({ data: { email: `user-${dateTag}@test.com` } });
      createdIds.push({ type: 'user', id: user.id });
      const topic1 = await jestPrisma.topic.create({
        data: { name: 'Public', isPublic: true, userId: user.id },
      });
      const topic2 = await jestPrisma.topic.create({
        data: { name: 'Private', isPublic: false, userId: user.id },
      });
      const topicIds = [topic1, topic2].map(({ id }) => id);
      topicIds.forEach((id) => createdIds.push({ type: 'topic', id }));
      mockedGetCurrentUser.mockResolvedValue(undefined);
      const { topics, totalCount } = await getAvailableTopics({ topicIds, noDebug: true });
      expect(topics).toHaveLength(1);
      expect(totalCount).toBe(1);
      expect(topics[0].id).toBe(topic1.id);
    } finally {
      await cleanupDb(createdIds);
    }
  });

  it('should return public and own topics for an authorized user by default', async () => {
    const dateTag = formatDateTag();
    const createdIds: CreatedId[] = [];
    try {
      const user1 = await jestPrisma.user.create({
        data: { email: `user1-${dateTag}@test.com`, role: 'USER' },
      });
      const user2 = await jestPrisma.user.create({ data: { email: `user2-${dateTag}@test.com` } });
      [user1, user2].forEach(({ id }) => createdIds.push({ type: 'user', id }));
      const topic0 = await jestPrisma.topic.create({
        data: { name: 'Public', isPublic: true, userId: user2.id },
      });
      const topic1 = await jestPrisma.topic.create({
        data: { name: 'Private', isPublic: false, userId: user1.id },
      });
      const topic2 = await jestPrisma.topic.create({
        data: { name: 'User2 Private', isPublic: false, userId: user2.id },
      });
      const topicIds = [topic0, topic1, topic2].map(({ id }) => id);
      topicIds.forEach((id) => createdIds.push({ type: 'topic', id }));
      mockedGetCurrentUser.mockResolvedValue(user1 as TExtendedUser);
      const { topics, totalCount } = await getAvailableTopics({ topicIds, noDebug: true });
      expect(totalCount).toBe(2);
      expect(topics.map((t) => t.id).sort()).toEqual([topic0.id, topic1.id].sort());
    } finally {
      await cleanupDb(createdIds);
    }
  });

  it('should return only own topics for an authorized user when showOnlyMyTopics is true', async () => {
    const dateTag = formatDateTag();
    const createdIds: CreatedId[] = [];
    try {
      const user1 = await jestPrisma.user.create({
        data: { email: `user1-${dateTag}@test.com`, role: 'USER' },
      });
      const user2 = await jestPrisma.user.create({
        data: { email: `user2-${dateTag}@test.com`, role: 'USER' },
      });
      [user1, user2].forEach(({ id }) => createdIds.push({ type: 'user', id }));
      const topic1 = await jestPrisma.topic.create({
        data: { name: `public-${dateTag}`, isPublic: false, userId: user1.id },
      });
      const topic2 = await jestPrisma.topic.create({
        data: { name: `public-${dateTag}`, isPublic: true, userId: user2.id },
      });
      const topicIds = [topic1, topic2].map(({ id }) => id);
      topicIds.forEach((id) => createdIds.push({ type: 'topic', id }));
      mockedGetCurrentUser.mockResolvedValue(user1 as TExtendedUser);
      const { topics, totalCount } = await getAvailableTopics({
        topicIds,
        showOnlyMyTopics: true,
        noDebug: true,
      });
      expect(totalCount).toBe(1);
      expect(topics[0].id).toBe(topic1.id);
    } finally {
      await cleanupDb(createdIds);
    }
  });

  it('should return all topics for an admin user in adminMode', async () => {
    const dateTag = formatDateTag();
    const createdIds: CreatedId[] = [];
    let admin: User | null = null;
    let user1: User | null = null;
    try {
      admin = await jestPrisma.user.create({
        data: { email: `admin-${dateTag}@test.com`, role: 'ADMIN' },
      });
      createdIds.push({ type: 'user', id: admin.id });
      user1 = await jestPrisma.user.create({
        data: { email: `user1-${dateTag}@test.com`, role: 'USER' },
      });
      createdIds.push({ type: 'user', id: user1.id });
      const t1 = await jestPrisma.topic.create({
        data: { name: 'Public', isPublic: true, userId: user1.id },
      });
      const t2 = await jestPrisma.topic.create({
        data: { name: 'Private', isPublic: false, userId: user1.id },
      });
      const t3 = await jestPrisma.topic.create({
        data: { name: 'Admin', isPublic: false, userId: admin.id },
      });
      const topicIds = [t1.id, t2.id, t3.id];
      topicIds.forEach((id) => createdIds.push({ type: 'topic', id }));
      mockedGetCurrentUser.mockResolvedValue(admin as TExtendedUser);
      const { topics, totalCount } = await getAvailableTopics({
        topicIds,
        adminMode: true,
        noDebug: true,
      });
      expect(totalCount).toBe(3);
      expect(topics).toHaveLength(3);
    } finally {
      await cleanupDb(createdIds);
    }
  });

  it('should not allow non-admin user to use adminMode', async () => {
    const dateTag = formatDateTag();
    const createdIds: CreatedId[] = [];
    try {
      const user1 = await jestPrisma.user.create({
        data: { email: `user1-${dateTag}@test.com`, role: 'USER' },
      });
      createdIds.push({ type: 'user', id: user1.id });
      mockedGetCurrentUser.mockResolvedValue(user1 as User & { role: UserRole });
      await expect(getAvailableTopics({ adminMode: true, noDebug: true })).rejects.toThrow(
        'Admin mode is allowed only for administrators',
      );
    } finally {
      await cleanupDb(createdIds);
    }
  });

  it('should include user info when includeUser is true', async () => {
    const dateTag = formatDateTag();
    const createdIds: CreatedId[] = [];
    try {
      const user1 = await jestPrisma.user.create({
        data: { email: `user1-${dateTag}@test.com` },
      });
      createdIds.push({ type: 'user', id: user1.id });
      const publicTopic = await jestPrisma.topic.create({
        data: { name: 'Public', isPublic: true, userId: user1.id },
      });
      createdIds.push({ type: 'topic', id: publicTopic.id });
      mockedGetCurrentUser.mockResolvedValue(undefined);
      const { topics } = await getAvailableTopics({ includeUser: true, noDebug: true });
      expect(topics[0].user).toBeDefined();
      expect(topics[0].user).not.toBeFalsy();
    } finally {
      await cleanupDb(createdIds);
    }
  });

  it('should not include user info when includeUser is false', async () => {
    const dateTag = formatDateTag();
    const createdIds: CreatedId[] = [];
    try {
      const user1 = await jestPrisma.user.create({
        data: { email: `user1-${dateTag}@test.com` },
      });
      createdIds.push({ type: 'user', id: user1.id });
      const publicTopic = await jestPrisma.topic.create({
        data: { name: 'Public', isPublic: true, userId: user1.id },
      });
      createdIds.push({ type: 'topic', id: publicTopic.id });
      mockedGetCurrentUser.mockResolvedValue(undefined);
      const { topics } = await getAvailableTopics({ includeUser: false, noDebug: true });
      expect(topics[0].user).toBeFalsy();
    } finally {
      await cleanupDb(createdIds);
    }
  });

  it('should include questions count when includeQuestionsCount is true', async () => {
    const dateTag = formatDateTag();
    const createdIds: CreatedId[] = [];
    try {
      const user1 = await jestPrisma.user.create({
        data: { email: `user1-${dateTag}@test.com` },
      });
      createdIds.push({ type: 'user', id: user1.id });
      const publicTopic = await jestPrisma.topic.create({
        data: { name: 'Public', isPublic: true, userId: user1.id },
      });
      createdIds.push({ type: 'topic', id: publicTopic.id });
      const question = await jestPrisma.question.create({
        data: { text: 'Q1', topicId: publicTopic.id },
      });
      createdIds.push({ type: 'question', id: question.id });
      mockedGetCurrentUser.mockResolvedValue(undefined);
      const { topics } = await getAvailableTopics({ includeQuestionsCount: true, noDebug: true });
      expect(topics.find((t) => t.id === publicTopic.id)?._count?.questions).toBe(1);
    } finally {
      await cleanupDb(createdIds);
    }
  });

  it('should handle pagination with skip and take', async () => {
    const dateTag = formatDateTag();
    const createdIds: CreatedId[] = [];
    try {
      const user = await jestPrisma.user.create({
        data: { email: `user-pagination-${dateTag}@test.com` },
      });
      createdIds.push({ type: 'user', id: user.id });
      const t1 = await jestPrisma.topic.create({
        data: { name: `t1-${dateTag}`, isPublic: true, userId: user.id },
      });
      const t2 = await jestPrisma.topic.create({
        data: { name: `t2-${dateTag}`, isPublic: true, userId: user.id },
      });
      const t3 = await jestPrisma.topic.create({
        data: { name: `t3-${dateTag}`, isPublic: true, userId: user.id },
      });
      const topicIds = [t1.id, t2.id, t3.id];
      topicIds.forEach((id) => createdIds.push({ type: 'topic', id }));
      mockedGetCurrentUser.mockResolvedValue(undefined);
      const { topics: page1, totalCount } = await getAvailableTopics({
        topicIds,
        take: 2,
        orderBy: { name: 'asc' },
        noDebug: true,
      });
      expect(page1).toHaveLength(2);
      expect(totalCount).toBe(3);
      const { topics: page2 } = await getAvailableTopics({
        topicIds,
        skip: 2,
        take: 2,
        noDebug: true,
      });
      expect(page2).toHaveLength(1);
    } finally {
      await cleanupDb(createdIds);
    }
  });

  describe('orderBy', () => {
    it('should order by name alphabetically', async () => {
      const dateTag = formatDateTag();
      const createdIds: CreatedId[] = [];
      try {
        const user = await jestPrisma.user.create({ data: { email: `user-${dateTag}@test.com` } });
        createdIds.push({ type: 'user', id: user.id });
        const t1 = await jestPrisma.topic.create({
          data: { name: 'B Topic', isPublic: true, userId: user.id },
        });
        const t2 = await jestPrisma.topic.create({
          data: { name: 'A Topic', isPublic: true, userId: user.id },
        });
        const t3 = await jestPrisma.topic.create({
          data: { name: 'C Topic', isPublic: true, userId: user.id },
        });
        const topicIds = [t1.id, t2.id, t3.id];
        topicIds.forEach((id) => createdIds.push({ type: 'topic', id }));
        mockedGetCurrentUser.mockResolvedValue(undefined);
        const { topics: asc } = await getAvailableTopics({
          topicIds,
          orderBy: { name: 'asc' },
          noDebug: true,
        });
        expect(asc.map((t) => t.name)).toEqual([
          // Compare results...
          'A Topic',
          'B Topic',
          'C Topic',
        ]);
        const { topics: desc } = await getAvailableTopics({
          topicIds,
          orderBy: { name: 'desc' },
          noDebug: true,
        });
        expect(desc.map((t) => t.name)).toEqual([
          // Compare results...
          'C Topic',
          'B Topic',
          'A Topic',
        ]);
      } finally {
        await cleanupDb(createdIds);
      }
    });

    it('should order by question count', async () => {
      const dateTag = formatDateTag();
      const createdIds: CreatedId[] = [];
      let user: User | null = null;
      try {
        user = await jestPrisma.user.create({ data: { email: `user-${dateTag}@test.com` } });
        createdIds.push({ type: 'user', id: user.id });
        const t1 = await jestPrisma.topic.create({
          data: { name: 'Topic 1 (1q)', isPublic: true, userId: user.id },
        });
        const t2 = await jestPrisma.topic.create({
          data: { name: 'Topic 2 (2q)', isPublic: true, userId: user.id },
        });
        const t3 = await jestPrisma.topic.create({
          data: { name: 'Topic 3 (0q)', isPublic: true, userId: user.id },
        });
        const topicIds = [t1.id, t2.id, t3.id];
        topicIds.forEach((id) => createdIds.push({ type: 'topic', id }));
        const q1 = await jestPrisma.question.create({ data: { text: 'q1', topicId: t2.id } });
        createdIds.push({ type: 'question', id: q1.id });
        const q2 = await jestPrisma.question.create({ data: { text: 'q2', topicId: t2.id } });
        createdIds.push({ type: 'question', id: q2.id });
        const q3 = await jestPrisma.question.create({ data: { text: 'q3', topicId: t1.id } });
        createdIds.push({ type: 'question', id: q3.id });
        mockedGetCurrentUser.mockResolvedValue(undefined);
        const { topics } = await getAvailableTopics({
          topicIds,
          orderBy: { questions: { _count: 'desc' } },
          noDebug: true,
        });
        const topicNames = topics.map((t) => t.name);
        expect(topicNames).toEqual([
          // Compare results...
          'Topic 2 (2q)',
          'Topic 1 (1q)',
          'Topic 3 (0q)',
        ]);
      } finally {
        await cleanupDb(createdIds);
      }
    });

    it('should order by most recent workout update date', async () => {
      const now = new Date();
      const nowTime = now.getTime();
      const dateTag = formatDateTag(now);
      const createdIds: CreatedId[] = [];
      let user: User | null = null;
      try {
        const email = `user-${dateTag}@test.com`;
        user = await jestPrisma.user.create({ data: { email } });

        const oldestTime = new Date(nowTime - 2 * dayMs);
        const middleTime = new Date(nowTime - 1 * dayMs);
        const newestTime = new Date(nowTime);

        const t1 = await jestPrisma.topic.create({
          data: { name: 'Topic 1 (oldest)', isPublic: true, userId: user.id },
        });
        const t2 = await jestPrisma.topic.create({
          data: { name: 'Topic 2 (middle)', isPublic: true, userId: user.id },
        });
        const t3 = await jestPrisma.topic.create({
          data: { name: 'Topic 3 (newest)', isPublic: true, userId: user.id },
        });
        const topicIds = [t1.id, t2.id, t3.id];
        topicIds.forEach((id) => createdIds.push({ type: 'topic', id }));

        // Create workouts with different updatedAt dates
        const w1 = await jestPrisma.userTopicWorkout.create({
          data: { userId: user.id, topicId: t1.id, updatedAt: oldestTime },
        });
        const w3 = await jestPrisma.userTopicWorkout.create({
          data: { userId: user.id, topicId: t3.id, updatedAt: newestTime },
        });
        const w2 = await jestPrisma.userTopicWorkout.create({
          data: { userId: user.id, topicId: t2.id, updatedAt: middleTime },
        });
        const workoutIds = [w1, w2, w3].map(({ userId, topicId }) => ({ userId, topicId }));
        workoutIds.forEach(({ userId, topicId }) =>
          createdIds.push({ type: 'workout', userId, topicId }),
        );

        mockedGetCurrentUser.mockResolvedValue(undefined);

        // Order by most recent workout updatedAt date using aggregation
        const { topics } = await getAvailableTopics({
          // orderBy: { userTopicWorkout: { _max: { updatedAt: 'desc' } } }
          topicIds,
          includeSortWorkouts: true,
        });
        const topicNamesDesc = topics.map((t) => t.name);
        expect(topicNamesDesc).toEqual([
          'Topic 3 (newest)',
          'Topic 2 (middle)',
          'Topic 1 (oldest)',
        ]);
      } finally {
        await cleanupDb(createdIds);
      }
    });
  });
});
