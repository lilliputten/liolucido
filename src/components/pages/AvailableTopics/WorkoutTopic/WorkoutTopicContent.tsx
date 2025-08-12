'use client';

import React from 'react';

import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { isDev } from '@/constants';
import { useQuestionsContext } from '@/contexts/QuestionsContext';
import { WorkoutContextProvider } from '@/contexts/WorkoutContext';
import { TAvailableTopic } from '@/features/topics/types';

import { WorkoutButtons } from './WorkoutButtons';

interface TWorkoutTopicContentProps {
  topic: TAvailableTopic;
  className?: string;
}

export function WorkoutTopicContent(props: TWorkoutTopicContentProps) {
  const { topic, className } = props;

  const questionsContext = useQuestionsContext();

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
          <WorkoutContextProvider
            topic={topic}
            questionIds={questionsContext.questions?.map((q) => q.id) || []}
          >
            <WorkoutButtons />
          </WorkoutContextProvider>
        </div>
      </ScrollArea>
    </div>
  );
}
