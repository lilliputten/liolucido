'use client';

import React from 'react';
import { useFormatter } from 'next-intl';

import { getFormattedRelativeDate } from '@/lib/helpers/dates';
import { cn } from '@/lib/utils';
import * as Icons from '@/components/shared/Icons';
import { isDev } from '@/constants';
import { TWorkout } from '@/features/workouts/types';

interface TWorkoutInfoProps {
  workout?: TWorkout;
  className?: string;
}

export function WorkoutInfo(props: TWorkoutInfoProps) {
  const { workout, className } = props;
  const format = useFormatter();

  if (!workout) {
    return (
      <div
        className={cn(
          isDev && '__WorkoutInfo_NoWorkout', // DEBUG
          'flex items-center gap-2 text-muted-foreground',
          className,
        )}
      >
        <Icons.Activity className="size-4 opacity-50" />
        <span>No workout started yet</span>
      </div>
    );
  }

  const { started, finished, startedAt, finishedAt, questionsCount, stepIndex, currentRatio } =
    workout;

  const isInProgress = started && !finished;
  const completionPercentage =
    questionsCount && stepIndex !== null && stepIndex !== undefined
      ? Math.round(((stepIndex + 1) / questionsCount) * 100)
      : 0;

  return (
    <div
      className={cn(
        isDev && '__WorkoutInfo', // DEBUG
        'flex flex-wrap items-center gap-4',
        className,
      )}
    >
      {/* Training Status */}
      <span className="flex items-center gap-1" title="Training status">
        <Icons.Activity className="mr-1 size-4 opacity-50" />
        {isInProgress && <span className="text-blue-600">In Progress</span>}
        {finished && <span className="text-green-600">Completed</span>}
        {!started && <span className="text-gray-500">Not Started</span>}
      </span>

      {/* Progress for active workout */}
      {isInProgress && questionsCount && stepIndex !== null && stepIndex !== undefined && (
        <span className="flex items-center gap-1" title="Current progress">
          <Icons.ChartNoAxesGantt className="mr-1 size-4 opacity-50" />
          {stepIndex + 1}/{questionsCount} ({completionPercentage}%)
        </span>
      )}

      {/* Current session stats */}
      {isInProgress && currentRatio !== null && (
        <span className="flex items-center gap-1" title="Current session ratio">
          <Icons.LineChart className="mr-1 size-4 opacity-50" />
          {currentRatio}%
        </span>
      )}

      {/* Started date */}
      {startedAt && (
        <span className="flex items-center gap-1" title="Started at">
          <Icons.ArrowRight className="mr-1 size-4 opacity-50" />
          {getFormattedRelativeDate(format, startedAt)}
        </span>
      )}

      {/* Finished date */}
      {finishedAt && (
        <span className="flex items-center gap-1" title="Finished at">
          <Icons.CircleCheck className="mr-1 size-4 opacity-50" />
          {getFormattedRelativeDate(format, finishedAt)}
        </span>
      )}
    </div>
  );
}
