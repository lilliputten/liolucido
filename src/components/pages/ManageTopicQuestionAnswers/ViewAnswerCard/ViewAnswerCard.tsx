'use client';

import React from 'react';

import { TPropsWithClassName } from '@/lib/types';
import { generateArray } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { PageError } from '@/components/shared/PageError';
import { isDev } from '@/constants';
import { AnswersBreadcrumbs } from '@/features/answers/components/AnswersBreadcrumbs';
import { TAnswerId } from '@/features/answers/types';
import { TQuestionId } from '@/features/questions/types';
import { TTopicId } from '@/features/topics/types';
import {
  useAvailableAnswerById,
  useAvailableQuestionById,
  useAvailableTopicById,
  useGoBack,
} from '@/hooks';
import { useManageTopicsStore } from '@/stores/ManageTopicsStoreProvider';

import { ViewAnswerContent } from './ViewAnswerContent';

interface TViewAnswerCardProps extends TPropsWithClassName {
  topicId: TTopicId;
  questionId: TQuestionId;
  answerId: TAnswerId;
}

export function ViewAnswerCard(props: TViewAnswerCardProps) {
  const { manageScope } = useManageTopicsStore();
  const { className, topicId, questionId, answerId } = props;

  if (!answerId) {
    throw new Error('No answer specified');
  }

  const toolbarPortalRef = React.useRef<HTMLDivElement>(null);
  const [toolbarPortalRoot, setToolbarPortalRoot] = React.useState<HTMLDivElement | null>(null);
  React.useEffect(() => setToolbarPortalRoot(toolbarPortalRef.current), [toolbarPortalRef]);

  // Calculate paths...
  const topicsListRoutePath = `/topics/${manageScope}`;
  const topicRoutePath = `${topicsListRoutePath}/${topicId}`;
  const questionsListRoutePath = `${topicRoutePath}/questions`;
  const questionRoutePath = `${questionsListRoutePath}/${questionId}`;
  const answersListRoutePath = `${questionRoutePath}/answers`;
  // const answerRoutePath = `${answersListRoutePath}/${answerId}`;

  // const goToTheRoute = useGoToTheRoute();
  const goBack = useGoBack(answersListRoutePath);

  const availableTopicQuery = useAvailableTopicById({ id: topicId });
  const {
    topic,
    // isFetched: isTopicFetched,
    // isLoading: isTopicLoading,
  } = availableTopicQuery;
  // const isTopicLoadingOverall = !topic && (!isTopicFetched || isTopicLoading);

  const availableQuestionQuery = useAvailableQuestionById({ id: questionId });
  const {
    question,
    // isFetched: isQuestionFetched,
    // isLoading: isQuestionLoading,
  } = availableQuestionQuery;
  // const isQuestionLoadingOverall = !question && (!isQuestionFetched || isQuestionLoading);

  const availableAnswerQuery = useAvailableAnswerById({
    id: answerId,
    // availableAnswersQueryKey,
    // includeQuestion: availableAnswersQueryProps.includeQuestion,
  });
  const { answer, isFetched: isAnswerFetched, isLoading: isAnswerLoading } = availableAnswerQuery;
  const isAnswerLoadingOverall = !answer && (!isAnswerFetched || isAnswerLoading);

  const answerCardContent = isAnswerLoadingOverall ? (
    <div
      className={cn(
        isDev && '__ViewAnswerCard_Form_Skeleton', // DEBUG
        'flex size-full flex-1 flex-col gap-4 p-6',
      )}
    >
      <Skeleton className="h-8 w-full rounded-lg" />
      {generateArray(1).map((i) => (
        <Skeleton key={i} className="h-20 w-full rounded-lg" />
      ))}
    </div>
  ) : answer ? (
    <ViewAnswerContent
      topicId={topicId}
      questionId={questionId}
      answer={answer}
      goBack={goBack}
      toolbarPortalRoot={toolbarPortalRoot}
    />
  ) : (
    <PageError
      className={cn(
        isDev && '__ViewAnswerCard_Form_Error', // DEBUG
      )}
      title="No answer found"
    />
  );

  return (
    <Card
      className={cn(
        isDev && '__ViewAnswerCard', // DEBUG
        'xl:col-span-2',
        'relative flex flex-1 flex-col overflow-hidden',
        className,
      )}
    >
      <CardHeader
        className={cn(
          isDev && '__ViewAnswerCard_Header', // DEBUG
          'item-start flex flex-col gap-4', // md:flex-row',
        )}
      >
        <div
          className={cn(
            isDev && '__ViewAnswerCard_TitleWrapper', // DEBUG
            'flex flex-1 flex-col justify-center gap-2 overflow-hidden',
          )}
        >
          <AnswersBreadcrumbs
            className={cn(
              isDev && '__ViewAnswerCard_Breadcrumbs', // DEBUG
            )}
            scope={manageScope}
            isLoading={!topic || !question || !answer}
            topic={topic}
            question={question}
            answer={answer}
            inactiveLast
          />
        </div>
        <div
          ref={toolbarPortalRef}
          className={cn(
            isDev && '__ViewAnswerCard_Toolbar', // DEBUG
            'flex flex-wrap items-center gap-2',
          )}
        >
          {isAnswerLoadingOverall &&
            generateArray(4).map((i) => <Skeleton key={i} className="h-9 w-24 rounded" />)}
        </div>
      </CardHeader>
      <CardContent
        className={cn(
          isDev && '__ViewAnswerCard_Content', // DEBUG
          'relative flex flex-1 flex-col overflow-hidden px-0',
        )}
      >
        {answerCardContent}
      </CardContent>
    </Card>
  );
}
