'use client';

import React from 'react';
import Link from 'next/link';
import { useFormatter } from 'next-intl';

import { compareDates, getFormattedRelativeDate } from '@/lib/helpers/dates';
import { truncateMarkdown } from '@/lib/helpers/markdown';
import { cn } from '@/lib/utils';
import { useAvailableQuestionById } from '@/hooks/react-query/useAvailableQuestionById';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MarkdownText } from '@/components/ui/MarkdownText';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Icons } from '@/components/shared/icons';
import { isDev } from '@/constants';
import { TAnswer } from '@/features/answers/types';
import { TTopicId } from '@/features/topics/types';
import { useAvailableTopicById, useSessionUser } from '@/hooks';
import { useManageTopicsStore } from '@/stores/ManageTopicsStoreProvider';

export function ViewAnswerContentSummary({
  topicId,
  answer,
}: {
  topicId: TTopicId;
  answer: TAnswer;
}) {
  const { manageScope } = useManageTopicsStore();
  const format = useFormatter();
  const user = useSessionUser();

  const questionId = answer.questionId;

  const topicsListPath = `/topics/${manageScope}`;
  const topicRoutePath = `${topicsListPath}/${topicId}`;
  const questionsListRoutePath = `${topicRoutePath}/questions`;
  // const questionRoutePath = `${questionsListRoutePath}/${questionId}`;
  // const answersListRoutePath = `${questionRoutePath}/answers`;
  // const answerRoutePath = `${answersListRoutePath}/${answerId}`;

  const availableTopicQuery = useAvailableTopicById({
    id: topicId,
    // availableTopicsQueryKey,
    // ...availableTopicsQueryProps,
    // includeWorkout: availableTopicsQueryProps.includeWorkout,
    // includeUser: availableTopicsQueryProps.includeUser,
    // includeQuestionsCount: availableTopicsQueryProps.includeQuestionsCount,
  });
  const { topic, isFetched: isTopicFetched, isLoading: isTopicLoading } = availableTopicQuery;
  const isTopicLoadingOverall =
    !topic && /* !isTopicsFetched || */ (!isTopicFetched || isTopicLoading);

  const availableQuestionQuery = useAvailableQuestionById({ id: questionId });
  const {
    question,
    isFetched: isQuestionFetched,
    isLoading: isQuestionLoading,
  } = availableQuestionQuery;
  const isQuestionLoadingOverall = !question && (!isQuestionFetched || isQuestionLoading);

  const isOwner = !!topic?.userId && topic?.userId === user?.id;

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
            <Link href={`${topicsListPath}/${topic.id}`} className="flex items-center gap-2">
              <Icons.edit className="size-3" />
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
        <p className="text-sm opacity-50">
          {topic._count?.questions ? (
            <span>
              <span className="opacity-50">Total questions:</span> {topic._count?.questions}
            </span>
          ) : (
            <span className="opacity-50">No questions:</span>
          )}
        </p>
      </div>
    </div>
  ) : null;

  const answerTextContent = (
    <div data-testid="__Section_AnswerText" className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold">Answer Text</h3>
      <div className="rounded-lg bg-slate-500/10 p-4">
        <MarkdownText>{answer.text}</MarkdownText>
      </div>
    </div>
  );

  const answerPropertiesContent = (
    <div data-testid="__Section_Properties" className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold">Properties</h3>
      <div className="flex flex-wrap gap-2">
        <Badge
          // variant={answer.isCorrect ? 'default' : 'secondary'}
          className={answer.isCorrect ? 'bg-green-500' : 'bg-red-500'}
        >
          <Icons.CircleCheck className="mr-1 h-3 w-3" />
          {answer.isCorrect ? 'Correct' : 'Incorrect'}
        </Badge>
        {answer.isGenerated && (
          <Badge variant="outline" className="border-slate-500 text-slate-500">
            <Icons.Bot className="mr-1 h-3 w-3" />
            AI Generated
          </Badge>
        )}
      </div>
    </div>
  );

  // TODO: Use skeleton if is lolading
  const questionInfoContent = isQuestionLoadingOverall ? (
    <div
      className={cn(
        isDev && '__ViewAnswerContentSummary_Question_Skeleton', // DEBUG
        'flex size-full flex-1 flex-col gap-4 py-4',
      )}
    >
      <Skeleton className="h-8 w-full rounded-lg" />
      {[...Array(1)].map((_, i) => (
        <Skeleton key={i} className="h-20 w-full rounded-lg" />
      ))}
    </div>
  ) : question ? (
    <div data-testid="__Section_Question" className="flex flex-col gap-4">
      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold">Question</h3>
        {isOwner && (
          <Button variant="ghost" size="sm">
            <Link
              href={`${questionsListRoutePath}/${question.id}`}
              className="flex items-center gap-2"
            >
              <Icons.edit className="size-3" />
              <span>Manage Question</span>
            </Link>
          </Button>
        )}
      </div>
      <div className="flex flex-col gap-2 rounded-lg bg-slate-500/10 p-3">
        <p className="font-medium">{truncateMarkdown(question.text, 100)}</p>
        <p className="text-sm opacity-50">
          {question._count?.answers ? (
            <span>
              <span className="opacity-50">Total answers:</span> {question._count.answers}
            </span>
          ) : (
            <span className="opacity-50">No answers</span>
          )}
        </p>
      </div>
    </div>
  ) : null;

  const authorInfoContent = (
    <div data-testid="__Section_Author" className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold">Author</h3>
      <div className="flex items-center gap-2 text-sm">
        {isOwner ? (
          <>
            <Icons.ShieldCheck className="h-4 w-4 opacity-50" />
            <span>You're the author</span>
          </>
        ) : (
          topic && (
            <>
              <Icons.user className="h-4 w-4 opacity-50" />
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
          <Icons.CalendarDays className="h-4 w-4 opacity-50" />
          <span className="opacity-50">Created:</span>
          <span>{getFormattedRelativeDate(format, answer.createdAt)}</span>
        </div>
        {!!compareDates(answer.updatedAt, answer.createdAt) && (
          <div className="flex items-center gap-2">
            <Icons.edit className="h-4 w-4 opacity-50" />
            <span className="opacity-50">Modified:</span>
            <span>{getFormattedRelativeDate(format, answer.updatedAt)}</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div
      className={cn(
        isDev && '__ViewAnswerContentSummary', // DEBUG
        'mx-6 flex w-full flex-col gap-4',
      )}
    >
      {answerTextContent}
      {answerPropertiesContent}
      <Separator />
      {questionInfoContent}
      {topicInfoContent}
      <Separator />
      {timestampsContent}
      {authorInfoContent}
    </div>
  );
}
