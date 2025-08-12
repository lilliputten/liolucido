'use client';

import React from 'react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useWorkoutContext } from '@/contexts/WorkoutContext';

interface TProps {
  startWorkout: () => void;
}

export function WorkoutTopicControl(props: TProps) {
  const { startWorkout } = props;
  const { workout, pending, createWorkout, restartWorkout } = useWorkoutContext();

  const handleCreateWorkout = () => {
    createWorkout();
  };

  /*
   * const router = useRouter();
   * const handleResumeWorkout = () => {
   *   router.push(`/topics/available/${topicId}/workout/go`);
   * };
   */

  const handleRestartWorkout = () => {
    restartWorkout();
  };

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
            ? 'Your workout is in progress' // TODO: Show the progress
            : 'The workout is ready to start'}
      </p>
      <div className="flex gap-2">
        <Button onClick={startWorkout} variant="default">
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
