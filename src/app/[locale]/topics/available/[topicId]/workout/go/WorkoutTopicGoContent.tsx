'use client';

import React from 'react';

import { cn } from '@/lib/utils';
import { WorkoutQuestionBlock } from '@/components/pages/AvailableTopics/WorkoutQuestionBlock/WorkoutQuestionBlock';
import { isDev } from '@/constants';
import { TAvailableTopic } from '@/features/topics/types';
import { WorkoutProgress } from '@/features/workouts/components';

interface TWorkoutTopicGoContentProps {
  topic: TAvailableTopic;
  className?: string;
}

export function WorkoutTopicGoContent(props: TWorkoutTopicGoContentProps) {
  const { className } = props;

  return (
    <div
      className={cn(
        isDev && '__WorkoutTopicGoContent', // DEBUG
        'flex w-full flex-col gap-4 overflow-hidden',
        className,
      )}
    >
      <div
        className={cn(
          isDev && '__WorkoutTopicGoContent_Scroll', // DEBUG
          'flex w-full flex-col gap-4 px-6',
          className,
        )}
      >
        <WorkoutProgress />
        <WorkoutQuestionBlock />
      </div>
    </div>
  );
}
