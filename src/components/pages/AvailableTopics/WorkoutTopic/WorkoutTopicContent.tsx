'use client';

import React from 'react';
import { useSession } from 'next-auth/react';

import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { isDev } from '@/constants';
import { useQuestionsContext } from '@/contexts/QuestionsContext';
import { TopicHeader } from '@/features/topics/components/TopicHeader';
import { TopicProperties } from '@/features/topics/components/TopicProperties';
import { TAvailableTopic } from '@/features/topics/types';

interface TWorkoutTopicContentProps {
  topic: TAvailableTopic;
  className?: string;
  // toolbarPortalRoot: HTMLDivElement | null;
  // toolbarPortalRef: React.RefObject<HTMLDivElement>;
  // goBack?: () => void;
  // handleDeleteTopic: TWorkoutTopicContentActionsProps['handleDeleteTopic'];
  // handleAddQuestion?: TWorkoutTopicContentActionsProps['handleAddQuestion'];
}

export function WorkoutTopicContent(props: TWorkoutTopicContentProps) {
  const {
    topic,
    className,
    // goBack,
    // handleDeleteTopic,
    // handleAddQuestion,
  } = props;
  const {
    // id,
    // userId,
    // user,
    // name,
    description,
    // isPublic,
    // langCode,
    // langName,
    // keywords,
    // createdAt,
    // updatedAt,
    // _count,
  } = topic;

  const questionsContext = useQuestionsContext();
  const session = useSession();

  console.log('[WorkoutTopicContent]', {
    session,
    topic,
    questionsContext,
  });

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
            'flex w-full flex-col gap-4 overflow-hidden',
            'mx-6',
            className,
          )}
        >
          CONTENT
        </div>
      </ScrollArea>
    </div>
  );
}
