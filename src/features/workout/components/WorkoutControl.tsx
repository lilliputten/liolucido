'use client';

import React from 'react';
import { useFormatter } from 'next-intl';

import { availableTopicsRoute } from '@/config/routesConfig';
import { formatSecondsDuration, getFormattedRelativeDate } from '@/lib/helpers/dates';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import * as Icons from '@/components/shared/Icons';
import { isDev } from '@/constants';
import { useWorkoutContext } from '@/contexts/WorkoutContext';
import { useGoToTheRoute } from '@/hooks';

interface TWorkoutControlProps {
  // topic: TAvailableTopic;
  // workout?: TWorkout;
  className?: string;
}

export function WorkoutControl(props: TWorkoutControlProps) {
  const {
    // topic,
    // workout,
    className,
  } = props;
  const format = useFormatter();
  const workoutContext = useWorkoutContext();
  const {
    userId,
    topicId,
    workout,
    pending,
    // createWorkout,
    startWorkout,
    questionIds,
  } = workoutContext;

  // const user = useSessionUser();
  // const userId = user?.id;

  console.log('[WorkoutControl:DEBUG]', {
    userId,
    questionIds,
    workout,
    // isOffline,
    pending,
    // queryKey,
  });

  // const [pending, setPending] = React.useState(false);
  const goToTheRoute = useGoToTheRoute();

  const isWorkoutInProgress = workout?.started && !workout?.finished;

  const handleCreateWorkout = () => {
    goToTheRoute(`${availableTopicsRoute}/${topicId}/workout`);
  };

  const handleResumeWorkout = () => {
    goToTheRoute(`${availableTopicsRoute}/${topicId}/workout/go`);
  };

  const handleStartWorkout = () => {
    debugger;
    startWorkout();
    setTimeout(handleResumeWorkout, 10);
  };

  // const handleStartWorkout = async () => {
  //   if (!user?.id || !workout) return;
  //   setPending(true);
  //   try {
  //     await updateWorkout(topicId, {
  //       started: true,
  //       finished: false,
  //       startedAt: new Date(),
  //       stepIndex: 0,
  //     });
  //     setTimeout(handleResumeWorkout, 10);
  //   } catch (error) {
  //     console.error('Failed to start workout:', error);
  //   } finally {
  //     setPending(false);
  //   }
  // };

  if (pending) {
    return (
      <div className={cn(isDev && '__WorkoutControl_Skeleton', 'flex flex-col gap-4', className)}>
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
    );
  }

  if (!workout) {
    return (
      <div className={cn(isDev && '__WorkoutControl_NoWorkout', 'flex flex-col gap-4', className)}>
        <p className="text-sm text-muted-foreground">No active workout found.</p>
        <Button onClick={handleStartWorkout} disabled={pending} className="flex w-fit gap-2">
          <Icons.Activity className="size-4 opacity-50" />
          <span>Start New Workout</span>
        </Button>
      </div>
    );
  }

  return (
    <div className={cn(isDev && '__WorkoutControl', 'flex flex-col gap-4', className)}>
      <p className="text-sm text-muted-foreground">
        {workout.finished
          ? `The workout is completed ${workout.finishedAt ? getFormattedRelativeDate(format, workout.finishedAt) : ''} in ${formatSecondsDuration(workout.currentTime || 0)} with a ratio of ${workout.currentRatio}% (${workout.correctAnswers} of ${workout.questionsCount} with correct answers).`
          : workout.started
            ? `Your workout is in progress (${(workout.stepIndex || 0) + 1} of ${workout.questionsCount} questions, started ${workout.startedAt ? getFormattedRelativeDate(format, workout.startedAt) : ''})`
            : `The workout has been created ${workout.startedAt ? getFormattedRelativeDate(format, workout.startedAt) : ''} and now is ready to start`}
      </p>
      <div className="flex gap-2">
        <Button
          onClick={isWorkoutInProgress ? handleResumeWorkout : handleStartWorkout}
          variant="default"
          className="flex gap-2"
          disabled={pending}
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
      </div>
    </div>
  );
}
