'use client';

import React from 'react';

import { TPropsWithClassName } from '@/shared/types/generic';
import { cn } from '@/lib/utils';
import { useAvailableQuestionById } from '@/hooks/react-query/useAvailableQuestionById';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { isDev } from '@/constants';
import { QuestionsBreadcrumbs } from '@/features/questions/components/QuestionsBreadcrumbs';
import { TQuestionId } from '@/features/questions/types';
import { TTopicId } from '@/features/topics/types';
import { useGoBack, useGoToTheRoute } from '@/hooks';
import { useManageTopicsStore } from '@/stores/ManageTopicsStoreProvider';

import { ViewQuestionContent } from './ViewQuestionContent';

interface TViewQuestionCardProps extends TPropsWithClassName {
  topicId: TTopicId;
  questionId: TQuestionId;
}

export function ViewQuestionCard(props: TViewQuestionCardProps) {
  const { manageScope } = useManageTopicsStore();
  const topicsListRoutePath = `/topics/${manageScope}`;
  const { className, topicId, questionId } = props;
  const toolbarPortalRef = React.useRef<HTMLDivElement>(null);
  const availableQuestionQuery = useAvailableQuestionById({ id: questionId });
  const {
    question,
    isFetched: isQuestionFetched,
    isLoading: isQuestionLoading,
  } = availableQuestionQuery;
  const isQuestionLoadingOverall = !question && (!isQuestionFetched || isQuestionLoading);
  const questionsListRoutePath = `${topicsListRoutePath}/${topicId}/questions`;

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
          'item-start flex flex-col gap-4 md:flex-row',
        )}
      >
        <div
          className={cn(
            isDev && '__EditQuestionCard_TitleWrapper', // DEBUG
            'flex flex-1 flex-col justify-center gap-2 overflow-hidden',
          )}
        >
          <QuestionsBreadcrumbs
            className={cn(
              isDev && '__EditQuestionCard_Breadcrumbs', // DEBUG
            )}
            questionId={questionId}
            inactiveQuestion
          />
          {/* // UNUSED: Title
            <CardTitle className="flex flex-1 items-center overflow-hidden">
              <span className="truncate">Show Question</span>
            </CardTitle>
            */}
        </div>
        <div
          ref={toolbarPortalRef}
          className={cn(
            isDev && '__ViewQuestionCard_Toolbar', // DEBUG
            'flex flex-wrap items-center gap-2',
          )}
        />
      </CardHeader>

      <CardContent
        className={cn(
          isDev && '__ViewQuestionCard_Content', // DEBUG
          'relative flex flex-1 flex-col overflow-hidden px-0',
        )}
      >
        <ViewQuestionContent
          question={question}
          goBack={goBack}
          handleDeleteQuestion={handleDeleteQuestion}
          handleAddQuestion={handleAddQuestion}
          toolbarPortalRef={toolbarPortalRef}
        />
      </CardContent>
    </Card>
  );
}
