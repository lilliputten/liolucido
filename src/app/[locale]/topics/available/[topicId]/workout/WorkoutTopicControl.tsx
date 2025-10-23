'use client';

import React from 'react';

import { availableTopicsRoute } from '@/config/routesConfig';
import { useWorkoutQuery } from '@/hooks/react-query/useWorkoutQuery';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import * as Icons from '@/components/shared/Icons';
import { TTopicId } from '@/features/topics/types';
import { WorkoutStateDetails } from '@/features/workouts/components';
import { useGoToTheRoute, useSessionUser } from '@/hooks';

export function WorkoutTopicControl({ topicId }: { topicId: TTopicId }) {
  // const { topicId, workout, pending, createWorkout, startWorkout } = useWorkoutContext();
  const user = useSessionUser();
  const userId = user?.id;
  const workoutQuery = useWorkoutQuery({ topicId, userId });
  const {
    workout,
    // questionIds,
    // isOffline,
    pending,
    // isLoading,
    // isFetched,
    // localInitialized,
    // queryKey,
    startWorkout,
    // startWorkout,
    createWorkout,
    // enabled,
    // preparing,
    // isQuestionIdsPending,
    // isQueryEnabled,
    // finishWorkout,
    // goNextQuestion,
    // updateWorkoutData,
  } = workoutQuery;

  const isWorkoutInProgress = workout?.started && !workout?.finished;

  const goToTheRoute = useGoToTheRoute();

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
        <Button onClick={createWorkout} disabled={pending} className="flex w-fit gap-2">
          <Icons.Activity className="size-4 opacity-50" />
          <span>Create New Workout</span>
        </Button>
      </div>
    );
  }

  const handleResumeWorkout = () => {
    goToTheRoute(`${availableTopicsRoute}/${topicId}/workout/go`);
  };

  const handleStartWorkout = () => {
    startWorkout();
    setTimeout(handleResumeWorkout, 10);
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        <WorkoutStateDetails workout={workout} />
      </p>
      <div className="flex gap-2">
        <Button
          data-testid="__WorkoutTopicControl_Start_Button"
          onClick={isWorkoutInProgress ? handleResumeWorkout : handleStartWorkout}
          variant="default"
          className="flex gap-2"
        >
          <Icons.Activity className="size-4 opacity-50" />
          <span>
            {workout.finished
              ? 'Restart Workout'
              : workout.started
                ? 'Resume Workout'
                : 'Start Workout'}
          </span>
        </Button>
        {/*!!workout.stepIndex && (
          <Button onClick={startWorkout} variant="outline">
            Restart Workout
          </Button>
        )*/}
      </div>
    </div>
  );
}
