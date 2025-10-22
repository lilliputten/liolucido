'use client';

import React from 'react';

import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { isDev } from '@/constants';
import { TTopicId } from '@/features/topics/types';

import { WorkoutTopicControl } from './WorkoutTopicControl';

interface TWorkoutTopicContentProps {
  // topic: TAvailableTopic;
  topicId: TTopicId;
  className?: string;
}

export function WorkoutTopicContent(props: TWorkoutTopicContentProps) {
  const { className, topicId } = props;
  return (
    <div
      className={cn(
        isDev && '__WorkoutTopicContent', // DEBUG
        'flex w-full flex-col gap-4 overflow-hidden',
        className,
      )}
    >
      <ScrollArea>
        <div
          className={cn(
            isDev && '__WorkoutTopicContent_Scroll', // DEBUG
            'flex w-full flex-col gap-4',
            'mx-6',
            className,
          )}
        >
          <WorkoutTopicControl topicId={topicId} />
        </div>
      </ScrollArea>
    </div>
  );
}
