'use client';

import React from 'react';

import { useWorkoutQuery } from '@/hooks/react-query/useWorkoutQuery';
import { TTopicId } from '@/features/topics/types';
import { TUserId } from '@/features/users/types/TUser';

type TUseWorkout = ReturnType<typeof useWorkoutQuery>;

const WorkoutContext = React.createContext<TUseWorkout | undefined>(undefined);

interface WorkoutContextProviderProps {
  userId?: TUserId;
  topicId: TTopicId;
  children: React.ReactNode;
}

export function WorkoutContextProvider({ userId, topicId, children }: WorkoutContextProviderProps) {
  // const availableTopicQuery = useAvailableTopicById({
  //   id: topicId,
  //   // availableTopicsQueryKey,
  //   // // ...availableTopicsQueryProps,
  //   // includeWorkout: availableTopicsQueryProps.includeWorkout,
  //   // includeUser: availableTopicsQueryProps.includeUser,
  //   // includeQuestionsCount: availableTopicsQueryProps.includeQuestionsCount,
  // });
  // const { topic, isFetched: isTopicFetched, isCached: isTopicCached } = availableTopicQuery;

  // const availableQuestionsQuery = useAvailableQuestions({ topicId, itemsLimit: null });
  // const {
  //   allQuestions,
  //   isFetched: isQuestionsFetched,
  //   isLoading: isQuestionsLoading,
  //   // queryKey: availableQuestionsQueryKey,
  //   // queryProps: availableQuestionsQueryProps,
  // } = availableQuestionsQuery;
  // const isPreparing = !!isQuestionsFetched && !isQuestionsLoading;
  //
  // const questionIds = allQuestions.map((q) => q.id);

  const workoutData = useWorkoutQuery({ topicId, userId });

  return <WorkoutContext.Provider value={workoutData}>{children}</WorkoutContext.Provider>;
}

export function useWorkoutContext() {
  const context = React.useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkoutContext must be used within WorkoutContextProvider');
  }
  return context;
}
