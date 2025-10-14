'use client';

import React from 'react';

import { generateArray } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/Skeleton';
import { isDev } from '@/constants';
import { TAnswerId } from '@/features/answers/types';
import { TQuestionId } from '@/features/questions/types';
import { TTopicId } from '@/features/topics/types';
import { useAvailableAnswerById, useAvailableQuestionById, useAvailableTopicById } from '@/hooks';

import { ViewAnswerCard } from './ViewAnswerCard';

interface TViewAnswerPageHolderProps {
  topicId: TTopicId;
  questionId: TQuestionId;
  answerId: TAnswerId;
}

export function ViewAnswerPageHolder(props: TViewAnswerPageHolderProps) {
  const { topicId, questionId, answerId } = props;
  // const { manageScope } = useManageTopicsStore();

  if (!topicId) {
    throw new Error('No topic ID specified');
  }
  if (!questionId) {
    throw new Error('No question ID specified');
  }
  if (!answerId) {
    throw new Error('No answer ID specified');
  }

  const availableTopicQuery = useAvailableTopicById({ id: topicId });
  const { topic, isFetched: isTopicFetched, isCached: isTopicCached } = availableTopicQuery;
  const isTopicReady = isTopicCached || isTopicFetched;

  const availableQuestionQuery = useAvailableQuestionById({ id: questionId });
  const {
    question,
    isFetched: isQuestionFetched,
    isCached: isQuestionCached,
  } = availableQuestionQuery;
  const isQuestionReady = isQuestionCached || isQuestionFetched;

  const availableAnswerQuery = useAvailableAnswerById({ id: answerId });
  const { answer, isFetched: isAnswerFetched, isCached: isAnswerCached } = availableAnswerQuery;
  const isAnswerReady = isAnswerCached || isAnswerFetched;

  // No data loaded yet - show skeleton
  if (!isTopicReady || !isQuestionReady || !isAnswerReady) {
    return (
      <div
        className={cn(
          isDev && '__ViewAnswerPageHolder_Skeleton', // DEBUG
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

  if (!topic) {
    throw new Error(`No topic found for ${topicId}`);
  }
  if (!question) {
    throw new Error(`No question found for ${questionId}`);
  }
  if (!answer) {
    throw new Error(`No answer found for ${answerId}`);
  }

  return <ViewAnswerCard topic={topic} question={question} answer={answer} />;
}
