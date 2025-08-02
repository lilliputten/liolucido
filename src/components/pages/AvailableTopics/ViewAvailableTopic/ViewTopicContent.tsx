'use client';

import React from 'react';
import Link from 'next/link';
import { createPortal } from 'react-dom';

import { useFormattedRelativeDate } from '@/lib/helpers/dates';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { Icons } from '@/components/shared/icons';
import { isDev } from '@/constants';
import { useTopicsContext } from '@/contexts/TopicsContext';
import { TTopic } from '@/features/topics/types';

import { TViewTopicContentActionsProps, ViewTopicContentActions } from './ViewTopicContentActions';

interface TViewTopicContentProps {
  topic: TTopic;
  className?: string;
  goBack?: () => void;
  handleDeleteTopic: TViewTopicContentActionsProps['handleDeleteTopic'];
  handleAddQuestion?: TViewTopicContentActionsProps['handleAddQuestion'];
  toolbarPortalRoot: HTMLDivElement | null;
}

export function ViewTopicContent(props: TViewTopicContentProps) {
  const { topic, className, goBack, handleDeleteTopic, handleAddQuestion, toolbarPortalRoot } =
    props;
  const {
    id,
    // userId,
    name,
    description,
    isPublic,
    langCode,
    langName,
    keywords,
    createdAt,
    // updatedAt,
    _count,
  } = topic;
  const questionsCount = _count?.questions;
  const topicsContext = useTopicsContext();
  const { routePath } = topicsContext;
  const createdAtFormatted = useFormattedRelativeDate(createdAt);
  const PublicIcon = isPublic ? Icons.Eye : Icons.EyeOff;
  // const router = useRouter();
  const topicRoutePath = `${routePath}/${id}`;
  // const trainRoutePath = `/train/topic/${id}`;
  const keywordsList = keywords
    ?.split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const keywordsContent = keywordsList?.map((kw, idx) => (
    <span key={`${idx}-${kw}`} className="rounded-sm bg-theme-500/10 px-2">
      {kw}
    </span>
  ));
  const langContent = [
    langName && <span key="langName">{langName}</span>,
    langCode && (
      <span key="langCode" className="opacity-50">
        ({langCode})
      </span>
    ),
  ].filter(Boolean);
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
          <div
            className={cn(
              isDev && '__ViewTopicContent_Stub', // DEBUG
              'flex w-full flex-col gap-4 overflow-hidden',
              'mx-6',
              className,
            )}
          >
            <div
              className={cn(
                // DEBUG
                'flex flex-1 flex-row gap-2',
                'max-sm:flex-col-reverse',
              )}
            >
              <div id="left-name" className="flex flex-1 flex-col gap-2 truncate">
                <div id="name" className="truncate">
                  <Link className="flex-1 truncate text-xl font-medium" href={topicRoutePath}>
                    {name}
                  </Link>
                </div>
              </div>
              <div id="right-tools" className="!mt-0 flex items-center gap-4 text-xs opacity-50">
                <span id="isPublic" title={isPublic ? 'Public' : 'Private'}>
                  <PublicIcon className="size-4" />
                </span>
                <span id="createdAt" title="Date of the creation">
                  {createdAtFormatted}
                </span>
              </div>
            </div>
            {!!description && (
              <div id="description" className="truncate">
                {/* TODO: Format text */}
                {description}
              </div>
            )}
            <div id="left-props" className="flex flex-1 flex-wrap items-center gap-4">
              {!!questionsCount && (
                <span id="questions" className="flex items-center gap-1" title="Questions count">
                  <Icons.questions className="mr-1 size-4 opacity-50" /> {questionsCount}
                </span>
              )}
              {!!(langName || langCode) && (
                <span id="language" className="flex items-center gap-1" title="Topic Language">
                  <Icons.Languages className="mr-1 size-4 opacity-50" /> {langContent}
                </span>
              )}
              {!!keywordsContent?.length && (
                <span id="keyword" className="flex flex-wrap items-center gap-1" title="Keywords">
                  <Icons.Tags className="mr-1 size-4 opacity-50" /> {keywordsContent}
                </span>
              )}
            </div>
            {/*
            <div id="right-actions" className="flex flex-wrap items-center gap-4">
              <Button variant="theme" onClick={startTraining} className="gap-2">
                <Icons.close className="size-4" />
                <span>Start Training</span>
              </Button>
              <Link
                onClick={startTraining}
                href={trainRoutePath}
                className={cn(buttonVariants({ variant: 'theme' }), 'flex gap-2')}
              >
                <Icons.arrowRight className="size-4" />
                <span>Start Training</span>
              </Link>
            </div>
            */}
          </div>
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
