'use client';

import React from 'react';
import Link from 'next/link';
import { useFormatter } from 'next-intl';

import { compareDates, getFormattedRelativeDate } from '@/lib/helpers/dates';
import { truncateMarkdown } from '@/lib/helpers/markdown';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MarkdownText } from '@/components/ui/MarkdownText';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Icons } from '@/components/shared/icons';
import { isDev } from '@/constants';
import { TQuestion } from '@/features/questions/types';
import { useAvailableTopicById, useAvailableTopicsByScope, useSessionUser } from '@/hooks';
import { useManageTopicsStore } from '@/stores/ManageTopicsStoreProvider';

export function ViewQuestionContentSummary({ question }: { question: TQuestion }) {
  const { manageScope } = useManageTopicsStore();
  const routePath = `/topics/${manageScope}`;
  const format = useFormatter();
  const user = useSessionUser();

  const availableTopics = useAvailableTopicsByScope({ manageScope });
  const {
    // allTopics,
    isFetched: isTopicsFetched,
    // isLoading: isTopicsLoading,
    queryKey: availableTopicsQueryKey,
    queryProps: availableTopicsQueryProps,
  } = availableTopics;

  const topicId = question.topicId;

  const availableTopicQuery = useAvailableTopicById({
    id: topicId,
    availableTopicsQueryKey,
    // ...availableTopicsQueryProps,
    includeWorkout: availableTopicsQueryProps.includeWorkout,
    includeUser: availableTopicsQueryProps.includeUser,
    includeQuestionsCount: availableTopicsQueryProps.includeQuestionsCount,
  });
  const {
    topic,
    isFetched: isTopicFetched,
    isLoading: isTopicLoading,
    // isCached: isTopicCached,
  } = availableTopicQuery;

  const isTopicLoadingOverall = !topic && (!isTopicsFetched || !isTopicFetched || isTopicLoading);
  const isOwner = !!topic?.userId && topic?.userId === user?.id;

  const questionTextContent = (
    <div data-testid="__Section_QuestionText" className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold">Question Text</h3>
      <div className="rounded-lg bg-slate-500/10 p-4">
        <MarkdownText>{question.text}</MarkdownText>
      </div>
    </div>
  );

  const questionPropertiesContent = (
    <div data-testid="__Section_Properties" className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold">Properties</h3>
      <div className="flex flex-wrap gap-2">
        {!!question._count?.answers && (
          <Link href={`${routePath}/${question.topicId}/questions/${question.id}/answers`}>
            <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
              <Icons.messages className="opcity-50 mr-1 size-3" />
              Answers: {question._count.answers}
            </Badge>
          </Link>
        )}
        {question.answersCountRandom && question.answersCountMin && question.answersCountMax && (
          <Badge variant="secondary" className="border-blue-500 text-blue-500">
            <Icons.Hash className="mr-1 size-3 opacity-50" />
            Random Answers: {question.answersCountMin}-{question.answersCountMax}
          </Badge>
        )}
      </div>
    </div>
  );

  const topicInfoContent = isTopicLoadingOverall ? (
    <div
      className={cn(
        isDev && '__Section_Topic_Skeleton', // DEBUG
        'size-full',
        'flex flex-1 flex-col gap-4 py-4',
      )}
    >
      <Skeleton className="h-8 w-full rounded-lg" />
      {[...Array(1)].map((_, i) => (
        <Skeleton key={i} className="h-20 w-full rounded-lg" />
      ))}
    </div>
  ) : topic ? (
    <div data-testid="__Section_Topic" className="flex flex-col gap-4">
      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold">Topic</h3>
        {isOwner && (
          <Button variant="ghost" size="sm">
            <Link href={`${routePath}/${topic.id}`} className="flex items-center gap-2">
              <Icons.edit className="size-3 opacity-50" />
              <span>Manage Topic</span>
            </Link>
          </Button>
        )}
      </div>
      <div className="flex flex-col gap-2 rounded-lg bg-slate-500/10 p-3">
        <p className="font-medium">{topic.name}</p>
        {topic.description && (
          <p className="text-sm opacity-50">{truncateMarkdown(topic.description, 100)}</p>
        )}
        {!!topic._count?.questions && (
          <p className="text-sm opacity-50">
            <span className="opacity-50">Total questions:</span> {topic._count?.questions}
          </p>
        )}
      </div>
    </div>
  ) : null;

  const authorInfoContent = (
    <div data-testid="__Section_Author" className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold">Author</h3>
      <div className="flex items-center gap-2 text-sm">
        {isOwner ? (
          <>
            <Icons.ShieldCheck className="hidden size-4 opacity-50 sm:flex" />
            <span>You're the author</span>
          </>
        ) : (
          topic?.user && (
            <>
              <Icons.user className="hidden size-4 opacity-50 sm:flex" />
              <span className="opacity-50">Topic created by:</span>
              <span>{topic.user?.name || topic.user?.email || 'Unknown'}</span>
            </>
          )
        )}
      </div>
    </div>
  );

  const timestampsContent = (
    <div data-testid="__Section_Timeline" className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold">Timeline</h3>
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <Icons.CalendarDays className="hidden size-4 opacity-50 sm:flex" />
          <span className="opacity-50">Created:</span>
          <span>{getFormattedRelativeDate(format, question.createdAt)}</span>
        </div>
        {!!compareDates(question.updatedAt, question.createdAt) && (
          <div className="flex items-center gap-2">
            <Icons.edit className="hidden size-4 opacity-50 sm:flex" />
            <span className="opacity-50">Modified:</span>
            <span>{getFormattedRelativeDate(format, question.updatedAt)}</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div
      className={cn(
        isDev && '__ViewQuestionContentSummary', // DEBUG
        'mx-6 flex w-full flex-col gap-4',
      )}
    >
      {questionTextContent}
      {questionPropertiesContent}
      <Separator />
      {topicInfoContent}
      <Separator />
      {timestampsContent}
      {authorInfoContent}
    </div>
  );
}
