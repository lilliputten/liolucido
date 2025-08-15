'use client';

import React from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { isDev } from '@/constants';
import { TAvailableTopic } from '@/features/topics/types';

import { TViewTopicContentActionsProps, ViewTopicContentActions } from './ViewTopicContentActions';
import { ViewTopicContentSummary } from './ViewTopicContentSummary';

interface TViewTopicContentProps {
  topic: TAvailableTopic;
  className?: string;
  goBack?: () => void;
  handleDeleteTopic: TViewTopicContentActionsProps['handleDeleteTopic'];
  handleAddQuestion?: TViewTopicContentActionsProps['handleAddQuestion'];
  toolbarPortalRoot: HTMLDivElement | null;
}

export function ViewTopicContent(props: TViewTopicContentProps) {
  const { topic, className, goBack, handleDeleteTopic, handleAddQuestion, toolbarPortalRoot } =
    props;
  return (
    <>
      <div
        className={cn(
          isDev && '__ViewTopicContent', // DEBUG
          'flex w-full flex-col gap-4 overflow-hidden',
          className,
        )}
      >
        <ScrollArea>
          <ViewTopicContentSummary topic={topic} />
        </ScrollArea>
      </div>
      {toolbarPortalRoot &&
        createPortal(
          <ViewTopicContentActions
            topic={topic}
            goBack={goBack}
            handleDeleteTopic={handleDeleteTopic}
            handleAddQuestion={handleAddQuestion}
          />,
          toolbarPortalRoot,
        )}
    </>
  );
}
