'use client';

import React from 'react';

import { availableTopicsRoute } from '@/config/routesConfig';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { isDev } from '@/constants';
import { TopicsManageScopeIds } from '@/contexts/TopicsContext';
import { TopicHeader } from '@/features/topics/components/TopicHeader';
import { TopicProperties } from '@/features/topics/components/TopicProperties';
import { TAvailableTopic } from '@/features/topics/types';
import { WorkoutControl, WorkoutInfo } from '@/features/workout/components';
import { TWorkout } from '@/features/workouts/types';

interface TViewAvailableTopicContentProps {
  topic: TAvailableTopic;
  workout?: TWorkout;
  className?: string;
}

// const manageScope = TopicsManageScopeIds.AVAILABLE_TOPICS;
// const routePath = topicsRoutes[manageScope];

export function ViewAvailableTopicContent(props: TViewAvailableTopicContentProps) {
  const manageScope = TopicsManageScopeIds.AVAILABLE_TOPICS;
  const { topic, workout, className } = props;
  // Topic
  const {
    id,
    // userId,
    // name,
    // description,
    // isPublic,
    // langCode,
    // langName,
    // keywords,
    // createdAt,
    // updatedAt,
    _count,
  } = topic;

  // const user = useSessionUser();
  // const isOwner = userId && userId === user?.id;
  // const isAdminMode = user?.role === 'ADMIN';
  // const allowedEdit = isAdminMode || isOwner;
  const questionsCount = _count?.questions;
  const allowedTraining = !!questionsCount;

  return (
    <div
      className={cn(
        isDev && '__ViewAvailableTopicContent', // DEBUG
        'flex w-full flex-col gap-4 overflow-hidden',
        className,
      )}
    >
      <ScrollArea>
        <div
          className={cn(
            isDev && '__ViewAvailableTopicContent_Scroll', // DEBUG
            'flex w-full flex-col gap-4 overflow-hidden',
            'mx-6',
            className,
          )}
        >
          <TopicHeader
            scope={manageScope}
            topic={topic}
            showDescription
            className="flex-1 max-sm:flex-col-reverse"
          />
          <TopicProperties topic={topic} className="flex-1 text-sm" showDates />
          <WorkoutInfo workout={workout} className="flex-1 text-sm" />
          {allowedTraining && <WorkoutControl />}
        </div>
      </ScrollArea>
    </div>
  );
}
