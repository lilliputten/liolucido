'use client';

import React from 'react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useWorkoutContext } from '@/contexts/WorkoutContext';

export function WorkoutButtons() {
  const { workout, pending, createWorkout, restartWorkout } = useWorkoutContext();

  const handleCreateWorkout = () => {
    createWorkout();
  };

  const handleResumeWorkout = () => {
    // TODO: Navigate to workout page
    console.log('[WorkoutButtons:handleResumeWorkout] Resume workout:', workout);
    debugger;
  };

  const handleRestartWorkout = () => {
    restartWorkout();
  };

  React.useEffect(() => {
    console.log('[eorkoutButtons] DEBUG', pending);
  }, [pending]);

  if (pending) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">No active workout found.</p>
        <Button onClick={handleCreateWorkout} className="w-fit" disabled={pending}>
          Start New Workout
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        {workout.finished
          ? 'The workout is completed'
          : workout.stepIndex
            ? 'Your workout is in progress'
            : 'The workout is ready to start'}
      </p>
      <div className="flex gap-2">
        <Button onClick={handleResumeWorkout} variant="default">
          {workout.finished
            ? 'Review Workout'
            : workout.stepIndex
              ? 'Resume Workout'
              : 'Start Workout'}
        </Button>
        {!!workout.stepIndex && (
          <Button onClick={handleRestartWorkout} variant="outline">
            Restart Workout
          </Button>
        )}
      </div>
    </div>
  );
}
