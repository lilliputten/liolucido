'use client';

import React from 'react';

import { TPropsWithClassName } from '@/shared/types/generic';
import { cn } from '@/lib/utils';
import { useAvailableQuestionById } from '@/hooks/react-query/useAvailableQuestionById';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { Skeleton } from '@/components/ui/skeleton';
import { isDev } from '@/constants';
import { QuestionsScopeBreadcrumbs } from '@/features/questions/components/QuestionsBreadcrumbs';
import { TQuestionId } from '@/features/questions/types';
import { TTopicId } from '@/features/topics/types';
import { useAvailableTopicById, useGoBack, useGoToTheRoute } from '@/hooks';
import { useManageTopicsStore } from '@/stores/ManageTopicsStoreProvider';

import { ViewQuestionContentActions } from './ViewQuestionContentActions';
import { ViewQuestionContentSummary } from './ViewQuestionContentSummary';

interface TViewQuestionCardProps extends TPropsWithClassName {
  topicId: TTopicId;
  questionId: TQuestionId;
}

export function ViewQuestionCard(props: TViewQuestionCardProps) {
  const { manageScope } = useManageTopicsStore();
  const topicsListRoutePath = `/topics/${manageScope}`;
  const { className, topicId, questionId } = props;

  const availableQuestionQuery = useAvailableQuestionById({ id: questionId });
  const {
    question,
    isFetched: isQuestionFetched,
    isLoading: isQuestionLoading,
  } = availableQuestionQuery;
  const isQuestionLoadingOverall = !question && (!isQuestionFetched || isQuestionLoading);
  const questionsListRoutePath = `${topicsListRoutePath}/${topicId}/questions`;

  const availableTopicQuery = useAvailableTopicById({ id: topicId });
  const { data: topic } = availableTopicQuery;

  const goToTheRoute = useGoToTheRoute();
  const goBack = useGoBack(questionsListRoutePath);

  // Add Question Modal
  const handleAddQuestion = React.useCallback(() => {
    const url = `${questionsListRoutePath}/add`;
    goToTheRoute(url);
  }, [goToTheRoute, questionsListRoutePath]);

  // Delete Question Modal
  const handleDeleteQuestion = React.useCallback(() => {
    if (question) {
      const url = `${questionsListRoutePath}/delete?questionId=${question.id}&from=ViewQuestionCard`;
      goToTheRoute(url);
      // NOTE: Dropped the check if the question existis (consider it as existed or rely on later checks)
    }
  }, [goToTheRoute, question, questionsListRoutePath]);

  // No data loaded yet: display skeleton
  if (isQuestionLoadingOverall) {
    return (
      <div
        className={cn(
          isDev && '__ViewQuestionCard_Skeleton', // DEBUG
          'size-full',
          'flex flex-1 flex-col gap-4 py-4',
          className,
        )}
      >
        <Skeleton className="h-8 w-48 rounded-lg" />
        <Skeleton className="h-8 w-full rounded-lg" />
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!question) {
    throw new Error(`No such question exists: ${questionId}`);
  }

  return (
    <Card
      className={cn(
        isDev && '__ViewQuestionCard', // DEBUG
        'xl:col-span-2',
        'relative flex flex-1 flex-col overflow-hidden',
        className,
      )}
    >
      <CardHeader
        className={cn(
          isDev && '__ViewQuestionCard_Header', // DEBUG
          'item-start flex flex-col gap-4 lg:flex-row',
        )}
      >
        <div
          className={cn(
            isDev && '__EditQuestionCard_TitleWrapper', // DEBUG
            'flex flex-1 flex-col justify-center gap-2 overflow-hidden',
          )}
        >
          <QuestionsScopeBreadcrumbs
            className={cn(
              isDev && '__EditQuestionCard_Breadcrumbs', // DEBUG
            )}
            scope={manageScope}
            isLoading={!topic}
            topic={topic}
            question={question}
            inactiveLast
          />
        </div>
        <ViewQuestionContentActions
          question={question}
          goBack={goBack}
          handleDeleteQuestion={handleDeleteQuestion}
          handleAddQuestion={handleAddQuestion}
        />
      </CardHeader>

      <CardContent
        className={cn(
          isDev && '__ViewQuestionCard_Content', // DEBUG
          'relative flex w-full flex-1 flex-col overflow-hidden px-0',
        )}
      >
        <ScrollArea>
          <ViewQuestionContentSummary question={question} />
        </ScrollArea>
        {/*
        <ViewQuestionContent
          question={question}
          goBack={goBack}
          handleDeleteQuestion={handleDeleteQuestion}
          handleAddQuestion={handleAddQuestion}
          // toolbarPortalRef={toolbarPortalRef}
          // toolbarPortalRoot={toolbarPortalRef.current}
        />
        */}
      </CardContent>
    </Card>
  );
}
