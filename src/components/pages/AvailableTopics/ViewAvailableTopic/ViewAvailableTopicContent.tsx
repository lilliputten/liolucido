'use client';

import React from 'react';

import { cn } from '@/lib/utils';
import { MarkdownText } from '@/components/ui/MarkdownText';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { isDev } from '@/constants';
import { TopicsManageScopeIds } from '@/contexts/TopicsContext';
import { TopicHeader } from '@/features/topics/components/TopicHeader';
import { TopicProperties } from '@/features/topics/components/TopicProperties';
import { TAvailableTopic } from '@/features/topics/types';

interface TViewAvailableTopicContentProps {
  topic: TAvailableTopic;
  className?: string;
}

export function ViewAvailableTopicContent(props: TViewAvailableTopicContentProps) {
  const manageScope = TopicsManageScopeIds.AVAILABLE_TOPICS;
  const { topic, className } = props;
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
            className="flex-1 max-sm:flex-col-reverse"
          />
          {!!description && (
            <div id="description" className="truncate">
              <MarkdownText>{description}</MarkdownText>
            </div>
          )}
          <TopicProperties topic={topic} className="flex-1 text-sm" showDates />
          {/* TODO: Show statistics, existed workout etc */}
        </div>
      </ScrollArea>
    </div>
  );
}
