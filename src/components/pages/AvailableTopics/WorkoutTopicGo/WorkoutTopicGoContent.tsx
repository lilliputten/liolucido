'use client';

import React from 'react';

import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { isDev } from '@/constants';
import { TAvailableTopic } from '@/features/topics/types';

import { WorkoutQuestionContainer } from '../WorkoutQuestion';

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
      <ScrollArea>
        <div
          className={cn(
            isDev && '__WorkoutTopicGoContent_Scroll', // DEBUG
            'mx-6 flex w-full flex-col gap-4',
            className,
          )}
        >
          <WorkoutQuestionContainer />
        </div>
      </ScrollArea>
    </div>
  );
}
