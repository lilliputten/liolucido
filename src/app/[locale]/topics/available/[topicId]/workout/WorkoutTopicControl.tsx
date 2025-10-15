'use client';

import React from 'react';
import { useFormatter } from 'next-intl';

import { availableTopicsRoute } from '@/config/routesConfig';
import { formatSecondsDuration, getFormattedRelativeDate } from '@/lib/helpers/dates';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import * as Icons from '@/components/shared/Icons';
import { useWorkoutContext } from '@/contexts/WorkoutContext';
import { useGoToTheRoute } from '@/hooks';

export function WorkoutTopicControl() {
  const format = useFormatter();
  const { topic, workout, pending, createWorkout, startWorkout } = useWorkoutContext();

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
          <span>Start New Workout</span>
        </Button>
      </div>
    );
  }

  const handleResumeWorkout = () => {
    const url = `${availableTopicsRoute}/${topic.id}/workout/go`;
    goToTheRoute(url);
  };

  const handleStartWorkout = () => {
    startWorkout();
    setTimeout(handleResumeWorkout, 10);
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        {workout.finished
          ? `The workout is completed ${getFormattedRelativeDate(format, workout.finishedAt)} in ${formatSecondsDuration(workout.currentTime)} with a ratio of ${workout.currentRatio}% (${workout.correctAnswers} of ${workout.questionsCount} with correct answers).`
          : workout.started
            ? `Your workout is in progress (${(workout.stepIndex || 0) + 1} of ${workout.questionsCount} questions, started ${getFormattedRelativeDate(format, workout.startedAt)})` // TODO: Show the progress?
            : `The workout has been created ${getFormattedRelativeDate(format, workout.startedAt)} and now is ready to start`}
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
