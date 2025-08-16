'use client';

import React from 'react';

import { useWorkout } from '@/hooks/useWorkout';
import { TAvailableTopic } from '@/features/topics/types';
import { TDefinedUserId } from '@/features/users/types/TUser';

type TUseWorkout = ReturnType<typeof useWorkout>;

const WorkoutContext = React.createContext<TUseWorkout | undefined>(undefined);

interface WorkoutContextProviderProps {
  userId?: TDefinedUserId;
  children: React.ReactNode;
  topic: TAvailableTopic;
  questionIds: string[];
}

export function WorkoutContextProvider({
  userId,
  children,
  topic,
  questionIds,
}: WorkoutContextProviderProps) {
  const workoutData = useWorkout(topic, questionIds, userId);

  return <WorkoutContext.Provider value={workoutData}>{children}</WorkoutContext.Provider>;
}

export function useWorkoutContext() {
  const context = React.useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkoutContext must be used within WorkoutContextProvider');
  }
  return context;
}
