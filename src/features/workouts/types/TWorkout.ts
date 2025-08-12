import { UserTopicWorkout } from '@prisma/client';

import { ExtendNullWithUndefined, ReplaceNullWithUndefined } from '@/lib/ts';

export type TWorkout = ExtendNullWithUndefined<UserTopicWorkout> & { _count?: { answers: number } };
export type TWorkoutReal = ReplaceNullWithUndefined<UserTopicWorkout>;

export type TNewWorkout = Partial<TWorkoutReal> & Pick<TWorkoutReal, 'userId' | 'topicId'>;
export type TWorkoutData = Partial<Pick<TWorkoutReal, 'questionsOrder' | 'finished' | 'stepIndex'>>;
