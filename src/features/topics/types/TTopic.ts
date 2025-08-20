import z from 'zod';

import { ExtendNullWithUndefined, ReplaceNullWithUndefined } from '@/lib/ts';
import { Topic, UserSchema, UserTopicWorkoutSchema } from '@/generated/prisma';

export type TTopic = ExtendNullWithUndefined<Topic> & { _count?: { questions: number } };
export type TTopicReal = ReplaceNullWithUndefined<TTopic>;

export type TTopicId = TTopic['id'];

export const IncludedUserSelect = {
  id: true as const, // z.string().cuid(),
  name: true as const, // z.string().nullable(),
  email: true as const, // z.string().nullable(),
  // emailVerified: true as const, // z.coerce.date().nullable(),
  // image: true as const, // z.string().nullable(),
  // createdAt: true as const, // z.coerce.date(),
  // updatedAt: true as const, // z.coerce.date(),
  // role: true as const, // z.string(),
};
const _IncludedUserSchema = UserSchema.pick(IncludedUserSelect);
type TIncludedUser = z.infer<typeof _IncludedUserSchema>;

export const IncludedUserTopicWorkoutSelect = {
  userId: true as const, // z.string(),
  topicId: true as const, // z.string(),
  createdAt: true as const, // z.coerce.date(),
  updatedAt: true as const, // z.coerce.date(),
  startedAt: true as const, // z.coerce.date().nullable(),
  finishedAt: true as const, // z.coerce.date().nullable(),
  // questionsCount: true as const, // z.number().int().nullable(),
  // questionsOrder: true as const, // z.string().nullable(),
  // questionResults: true as const, // z.string().nullable(),
  stepIndex: true as const, // z.number().int().nullable(),
  // selectedAnswerId: true as const, // z.string().nullable(),
  // currentRatio: true as const, // z.number().int().nullable(),
  // currentTime: true as const, // z.number().int().nullable(),
  // correctAnswers: true as const, // z.number().int().nullable(),
  // totalRounds: true as const, // z.number().int(),
  // allRatios: true as const, // z.string(),
  // allTimes: true as const, // z.string(),
  averageRatio: true as const, // z.number().int(),
  averageTime: true as const, // z.number().int(),
  started: true as const, // z.boolean(),
  finished: true as const, // z.boolean(),
};
const _IncludedUserTopicWorkoutSchema = UserTopicWorkoutSchema.pick(IncludedUserTopicWorkoutSelect);
type TIncludedUserTopicWorkout = z.infer<typeof _IncludedUserTopicWorkoutSchema>;

/** Extended topic, includes some user data, see `getAvailableTopics` */
export type TAvailableTopic = TTopic & {
  /** For `includeUser` flag */
  user?: TIncludedUser;
  /** For `includeWorkout` flag */
  userTopicWorkout?: TIncludedUserTopicWorkout;
};

/** // XXX: New topic shouldn't contain id (?)
 * export type TTopicWithoutId = Omit<TTopic, 'id'>;
 * export type TTopicWithoutUserId = Omit<TTopic, 'userId'>;
 * export type TTopicWithoutIds = Omit<TTopic, 'id' | 'userId'>;
 */

export type TOptionalTopic = Partial<TTopic>;
export type TNewTopic = Partial<Topic> & Pick<Topic, 'name'>; // TTopicWithoutIds; // { name: TTopic['name']; parentId: TTopic['parentId'] };
