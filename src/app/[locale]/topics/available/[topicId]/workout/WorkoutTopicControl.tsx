'use client';

import React from 'react';
import { useFormatter } from 'next-intl';

import { availableTopicsRoute } from '@/config/routesConfig';
import { formatSecondsDuration, getFormattedRelativeDate } from '@/lib/helpers/dates';
import { useWorkoutQuery } from '@/hooks/react-query/useWorkoutQuery';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import * as Icons from '@/components/shared/Icons';
import { useWorkoutContext } from '@/contexts/WorkoutContext';
import { TTopicId } from '@/features/topics/types';
import { TWorkoutData } from '@/features/workouts/types';
import { useGoToTheRoute, useSessionUser } from '@/hooks';

function WorkoutInfo({ workout }: { workout?: TWorkoutData }) {
  const format = useFormatter();
  if (!workout) {
    return <>No workout created</>;
  }
  if (!workout.started || !workout.startedAt) {
    if (workout.finished && workout.finishedAt) {
      return (
        <>
          The workout is completed {getFormattedRelativeDate(format, workout.finishedAt)} in{' '}
          {formatSecondsDuration(workout.currentTime || 0)} with a ratio of{' '}
          {workout.currentRatio || 0}% ({workout.correctAnswers || 0} of{' '}
          {workout.questionsCount || 0} with correct answers).
        </>
      );
    }
    return <>Workout hasn't been started yet</>;
  }
  if (workout.stepIndex) {
    return (
      <>
        Your workout is in progress ({workout.stepIndex + 1} of {workout.questionsCount || 0}{' '}
        questions, started {getFormattedRelativeDate(format, workout.startedAt)})
      </>
    );
  }
  return (
    <>
      The workout has been created {getFormattedRelativeDate(format, workout.startedAt)} and now is
      ready to start
    </>
  );
}

export function WorkoutTopicControl({ topicId }: { topicId: TTopicId }) {
  // const { topicId, workout, pending, createWorkout, startWorkout } = useWorkoutContext();
  const user = useSessionUser();
  const userId = user?.id;
  const workoutQuery = useWorkoutQuery({ topicId, userId });
  const {
    workout,
    questionIds,
    // isOffline,
    pending,
    isLoading,
    isFetched,
    // localInitialized,
    queryKey,
    startWorkout,
    createWorkout,
    // enabled,
    // preparing,
    // isQuestionIdsPending,
    // isQueryEnabled,
    // finishWorkout,
    // goNextQuestion,
    // updateWorkoutData,
  } = workoutQuery;

  console.log('[WorkoutTopicControl:DEBUG]', {
    user,
    userId,
    topicId,
    questionIds,
    workout,
    // isOffline,
    // localInitialized,
    pending,
    queryKey,
    // enabled,
    // preparing,
    isLoading,
    isFetched,
    // isQuestionIdsPending,
    // isQueryEnabled,
  });

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
    debugger;
    startWorkout();
    setTimeout(handleResumeWorkout, 10);
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        <WorkoutInfo workout={workout} />
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
