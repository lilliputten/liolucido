'use client';

import React from 'react';

import { generateArray } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/Skeleton';
import { isDev } from '@/constants';
import { useAvailableQuestions, useAvailableTopicById } from '@/hooks';

import {
  ManageTopicQuestionsListCard,
  TManageTopicQuestionsListCardProps,
} from './ManageTopicQuestionsListCard';

type TManageTopicQuestionsPageHolderProps = Omit<
  TManageTopicQuestionsListCardProps,
  'availableTopicQuery' | 'availableQuestionsQuery'
>;

export function ManageTopicQuestionsPageHolder(props: TManageTopicQuestionsPageHolderProps) {
  const { topicId } = props;
  // const { manageScope } = useManageTopicsStore();

  if (!topicId) {
    throw new Error('No topic specified');
  }

  // const availableTopicsQuery = useAvailableTopicsByScope({ manageScope });
  // const {
  //   isFetched: isTopicsFetched,
  //   queryKey: availableTopicsQueryKey,
  //   queryProps: availableTopicsQueryProps,
  // } = availableTopicsQuery;

  const availableTopicQuery = useAvailableTopicById({
    id: topicId,
    // availableTopicsQueryKey,
    // // ...availableTopicsQueryProps,
    // includeWorkout: availableTopicsQueryProps.includeWorkout,
    // includeUser: availableTopicsQueryProps.includeUser,
    // includeQuestionsCount: availableTopicsQueryProps.includeQuestionsCount,
  });

  const {
    // topic,
    isFetched: isTopicFetched,
    isCached: isTopicCached,
  } = availableTopicQuery;

  const availableQuestionsQuery = useAvailableQuestions({ topicId });
  const { isFetched: isQuestionsFetched } = availableQuestionsQuery;

  const isTopicReady = isTopicCached || isTopicFetched;

  // No data loaded yet - show skeleton
  if (!isQuestionsFetched || !isTopicReady) {
    return (
      <div
        className={cn(
          isDev && '__ManageTopicQuestionsPageHolder_Skeleton', // DEBUG
          'size-full px-6',
          'flex flex-1 flex-col gap-4 py-4',
        )}
      >
        <Skeleton className="h-8 w-48 rounded-lg" />
        <Skeleton className="h-8 w-full rounded-lg" />
        {generateArray(3).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <ManageTopicQuestionsListCard
      availableTopicQuery={availableTopicQuery}
      availableQuestionsQuery={availableQuestionsQuery}
      {...props}
    />
  );
}
