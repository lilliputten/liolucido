'use client';

import React from 'react';

import { useWorkoutContext } from '@/contexts/WorkoutContext';

export function useQuestionsOrder() {
  const { workout } = useWorkoutContext();

  // Prepare data...
  const questionsOrder = React.useMemo(
    () => (workout?.questionsOrder ? workout?.questionsOrder.split(' ') : []),
    [workout?.questionsOrder],
  );

  return questionsOrder;
}
