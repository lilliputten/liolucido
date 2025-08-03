'use client';

import React from 'react';

import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { isDev } from '@/constants';
import { TopicHeader } from '@/features/topics/components/TopicHeader';
import { TopicProperties } from '@/features/topics/components/TopicProperties';
import { TAvailableTopic } from '@/features/topics/types';

interface TViewTopicContentProps {
  topic: TAvailableTopic;
  className?: string;
  // toolbarPortalRoot: HTMLDivElement | null;
  // toolbarPortalRef: React.RefObject<HTMLDivElement>;
  // goBack?: () => void;
  // handleDeleteTopic: TViewTopicContentActionsProps['handleDeleteTopic'];
  // handleAddQuestion?: TViewTopicContentActionsProps['handleAddQuestion'];
}

export function ViewTopicContent(props: TViewTopicContentProps) {
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
  return (
    <div
      className={cn(
        isDev && '__ViewTopicContent', // DEBUG
        'flex w-full flex-col gap-4 overflow-hidden',
        className,
      )}
    >
      <ScrollArea>
        <div
          className={cn(
            isDev && '__ViewTopicContent_Scroll', // DEBUG
            'flex w-full flex-col gap-4 overflow-hidden',
            'mx-6',
            className,
          )}
        >
          <TopicHeader topic={topic} className="flex-1 max-sm:flex-col-reverse" />
          {!!description && (
            <div id="description" className="truncate">
              {/* TODO: Format text */}
              {description}
            </div>
          )}
          <TopicProperties topic={topic} className="flex-1 text-sm" showDates />
        </div>
      </ScrollArea>
    </div>
  );
}
