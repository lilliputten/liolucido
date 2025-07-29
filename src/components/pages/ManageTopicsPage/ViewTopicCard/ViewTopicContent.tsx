'use client';

import React from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { isDev } from '@/constants';
import { TTopic } from '@/features/topics/types';

import { TViewTopicContentActionsProps, ViewTopicContentActions } from './ViewTopicContentActions';

interface TViewTopicContentProps {
  topic: TTopic;
  className?: string;
  goBack?: () => void;
  handleDeleteTopic: TViewTopicContentActionsProps['handleDeleteTopic'];
  toolbarPortalRoot: HTMLDivElement | null;
}

export function ViewTopicContent(props: TViewTopicContentProps) {
  const { topic, className, goBack, handleDeleteTopic, toolbarPortalRoot } = props;
  return (
    <>
      <div
        className={cn(
          isDev && '__ViewTopicContent', // DEBUG
          'flex w-full flex-col gap-4 overflow-hidden',
          // isPending && 'pointer-events-none opacity-50',
          className,
        )}
      >
        <ScrollArea>
          <div
            className={cn(
              isDev && '__ViewTopicContent_Stub', // DEBUG
              'flex w-full flex-col gap-4 overflow-hidden',
              'mx-6',
              className,
            )}
          >
            Here comes some topic overview and summary.
          </div>
        </ScrollArea>
      </div>
      {toolbarPortalRoot &&
        createPortal(
          <ViewTopicContentActions
            topic={topic}
            // isPending={isPending}
            goBack={goBack}
            handleDeleteTopic={handleDeleteTopic}
          />,
          toolbarPortalRoot,
        )}
    </>
  );
}
