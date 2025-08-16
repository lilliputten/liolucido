import { ExtendNullWithUndefined, ReplaceNullWithUndefined } from '@/lib/ts';
import { UserTopicWorkout } from '@/generated/prisma';

export type TWorkout = ExtendNullWithUndefined<UserTopicWorkout> & { _count?: { answers: number } };
export type TWorkoutReal = ReplaceNullWithUndefined<UserTopicWorkout>;

export type TNewWorkout = Partial<TWorkoutReal> & Pick<TWorkoutReal, 'userId' | 'topicId'>;
export type TWorkoutData = Omit<
  TWorkoutReal,
  'userId' | 'user' | 'topicId' | 'topic' | 'createdAt' | 'updatedAt'
>;
