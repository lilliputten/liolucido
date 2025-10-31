import React from 'react';

import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/Progress';
import { Skeleton } from '@/components/ui/Skeleton';
import { isDev } from '@/constants';
import { useWorkoutContext } from '@/contexts/WorkoutContext';

export function WorkoutProgress() {
  const { workout, pending, questionIds } = useWorkoutContext();
  const totalSteps = questionIds?.length || 0;
  const stepIndex = workout?.stepIndex || 0;
  const currentStep = stepIndex + 1;
  const progressStep = workout?.selectedAnswerId ? currentStep : currentStep - 1;
  const progress = totalSteps ? (progressStep / totalSteps) * 100 : 0;
  if (pending) {
    return (
      <div
        className={cn(
          isDev && '__WorkoutProgress_Skeleton', // DEBUG
          'flex flex-col gap-2 py-2',
        )}
      >
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-2 w-full" />
      </div>
    );
  }
  return (
    <div data-testid="__WorkoutProgress" className="space-y-2">
      <div
        className={cn(
          isDev && '__WorkoutProgress', // DEBUG
          'flex justify-between text-sm text-muted-foreground',
        )}
      >
        <span>
          Question {currentStep || 0} of {totalSteps || 0}
        </span>
        <span>{Math.round(progress)}%</span>
      </div>
      <Progress
        value={progress}
        className="h-2 bg-theme-500/20 transition"
        indicatorClassName="bg-secondary-500"
      />
    </div>
  );
}
