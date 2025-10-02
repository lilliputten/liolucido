'use client';

import React from 'react';
import { useFormatter } from 'next-intl';

import { availableTopicsRoute } from '@/config/routesConfig';
import { formatSecondsDuration, getFormattedRelativeDate } from '@/lib/helpers/dates';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/skeleton';
import { useWorkoutContext } from '@/contexts/WorkoutContext';
import { useGoToTheRoute } from '@/hooks';

interface TProps {
  startWorkout: () => void;
}

export function WorkoutTopicGoControl(props: TProps) {
  const format = useFormatter();
  const { startWorkout } = props;
  const { topic, workout, pending, createWorkout } = useWorkoutContext();
  // const { topicId } = workout;

  const isWorkoutInProgress = workout?.started && !workout?.finished;

  const workoutRoutePath = `${availableTopicsRoute}/${topic.id}/workout`;
  const workoutGoRoutePath = `${workoutRoutePath}/go`;

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
        <Button onClick={createWorkout} className="w-fit" disabled={pending}>
          Start New Workout
        </Button>
      </div>
    );
  }

  const resumeWorkout = () => {
    goToTheRoute(workoutGoRoutePath);
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
          data-testid="__WorkoutTopicGoControl_Start_Button"
          onClick={isWorkoutInProgress ? resumeWorkout : startWorkout}
          variant="default"
        >
          {workout.finished
            ? 'Restart Workout'
            : workout.started
              ? 'Resume Workout'
              : 'Start Workout'}
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
