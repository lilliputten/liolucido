'use client';

import React from 'react';

import { generateArray } from '@/lib/helpers';
import { TPropsWithClassName } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useAvailableQuestionById } from '@/hooks/react-query/useAvailableQuestionById';
import { useAvailableQuestions } from '@/hooks/react-query/useAvailableQuestions';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import * as Icons from '@/components/shared/Icons';
import { PageError } from '@/components/shared/PageError';
import { isDev } from '@/constants';
import { QuestionsBreadcrumbs } from '@/features/questions/components/QuestionsBreadcrumbs';
import { TQuestionId } from '@/features/questions/types';
import { TTopicId } from '@/features/topics/types';
import { useAvailableTopicById, useGoBack, useGoToTheRoute } from '@/hooks';
import { useManageTopicsStore } from '@/stores/ManageTopicsStoreProvider';

import { topicQuestionDeletedEventId } from '../DeleteQuestionModal';
import { EditQuestionForm } from './EditQuestionForm';

interface TEditQuestionCardProps extends TPropsWithClassName {
  topicId: TTopicId;
  questionId: TQuestionId;
}
type TToolbarProps = {
  goBack: () => void;
  // toolbarPortalRef: React.RefObject<HTMLDivElement>;
  toolbarPortalRef: (node: HTMLDivElement | null) => void;
  isLoading?: boolean;
};

function Toolbar({ toolbarPortalRef, isLoading }: TToolbarProps) {
  return (
    <div
      ref={toolbarPortalRef}
      className={cn(
        isDev && '__EditQuestionCard_Toolbar', // DEBUG
        'flex flex-wrap items-center gap-2',
      )}
    >
      {isLoading && generateArray(3).map((i) => <Skeleton key={i} className="h-9 w-24 rounded" />)}
      {/* // Example
      <Button disabled variant="ghost" size="sm" className="flex gap-2">
        <Link href="#" className="flex items-center gap-2">
          <Icons.Refresh className="hidden size-4 sm:block" />
          <span>Refresh</span>
        </Link>
      </Button>
      */}
    </div>
  );
}

export function EditQuestionCard(props: TEditQuestionCardProps) {
  const { manageScope } = useManageTopicsStore();
  const { className, topicId, questionId } = props;

  // const toolbarPortalRef = React.useRef<HTMLDivElement>(null);
  const [toolbarPortalNode, setToolbarPortalNode] = React.useState<HTMLDivElement | null>(null);

  const [hasDeleted, setHasDeleted] = React.useState(false);

  const topicsListRoutePath = `/topics/${manageScope}`;
  const topicRoutePath = `${topicsListRoutePath}/${topicId}`;
  const questionsListRoutePath = `${topicRoutePath}/questions`;
  // const questionRoutePath = `${questionsListRoutePath}/${questionId}`;
  // const answersListRoutePath = `${questionRoutePath}/answers`;
  // const answerRoutePath = `${answersListRoutePath}/${answerId}`;

  const goToTheRoute = useGoToTheRoute();
  const goBack = useGoBack(questionsListRoutePath);

  const availableTopicQuery = useAvailableTopicById({ id: topicId });
  const {
    data: topic,
    // isFetched: isTopicFetched,
    // isLoading: isTopicLoading,
  } = availableTopicQuery;
  // const isTopicLoadingOverall = !topic && (!isTopicFetched || isTopicLoading);

  const availableQuestionsQuery = useAvailableQuestions({ topicId });
  const {
    // ...
    queryKey: availableQuestionsQueryKey,
    queryProps: availableQuestionsQueryProps,
  } = availableQuestionsQuery;

  const availableQuestionQuery = useAvailableQuestionById({
    id: questionId,
    availableQuestionsQueryKey,
    includeTopic: availableQuestionsQueryProps.includeTopic,
    includeAnswersCount: availableQuestionsQueryProps.includeAnswersCount,
  });
  const {
    question,
    isFetched: isQuestionFetched,
    isLoading: isQuestionLoading,
  } = availableQuestionQuery;
  const isQuestionLoadingOverall = !question && (!isQuestionFetched || isQuestionLoading);

  if (!questionId || (!question && !hasDeleted && !isQuestionLoadingOverall)) {
    throw new Error('No such question exists');
  }

  // Add Question Modal
  const handleAddQuestion = React.useCallback(() => {
    const url = `${questionsListRoutePath}/add`;
    goToTheRoute(url);
  }, [goToTheRoute, questionsListRoutePath]);

  // Delete Question Modal
  const handleDeleteQuestion = React.useCallback(() => {
    const url = `${questionsListRoutePath}/delete?questionId=${questionId}`;
    goToTheRoute(url);
  }, [goToTheRoute, questionId, questionsListRoutePath]);

  // Watch if the question has been deleted (???)
  React.useEffect(() => {
    const handleQuestionDeleted = (event: CustomEvent<TQuestionId>) => {
      const id = event.detail;
      // Make sure the event is for this topic
      if (questionId === id) {
        setHasDeleted(true);
      }
    };
    window.addEventListener(topicQuestionDeletedEventId, handleQuestionDeleted as EventListener);
    return () => {
      window.removeEventListener(
        topicQuestionDeletedEventId,
        handleQuestionDeleted as EventListener,
      );
    };
  }, [questionId]);

  // Effect:hasDeleted
  React.useEffect(() => {
    if (hasDeleted) {
      goBack();
    }
  }, [goBack, hasDeleted]);

  if (hasDeleted) {
    // TODO: Show 'Question has been removed' info?
    return <PageError icon={Icons.Trash} title="The question has been removed" />;
  }

  const questionFormContent = isQuestionLoadingOverall ? (
    <div
      className={cn(
        isDev && '__EditQuestionCard_Form_Skeleton', // DEBUG
        'flex size-full flex-1 flex-col gap-4 p-6',
      )}
    >
      <Skeleton className="h-8 w-full rounded-lg" />
      {[...Array(1)].map((_, i) => (
        <Skeleton key={i} className="h-20 w-full rounded-lg" />
      ))}
    </div>
  ) : question ? (
    <EditQuestionForm
      className={cn(
        isDev && '__EditQuestionCard_Form_Content', // DEBUG
      )}
      availableQuestionsQuery={availableQuestionsQuery}
      question={question}
      onCancel={goBack}
      toolbarPortalRoot={toolbarPortalNode}
      handleDeleteQuestion={handleDeleteQuestion}
      handleAddQuestion={handleAddQuestion}
    />
  ) : (
    <PageError
      className={cn(
        isDev && '__EditQuestionCard_Form_Error', // DEBUG
      )}
      title="No question found"
    />
  );

  return (
    <Card
      className={cn(
        isDev && '__EditQuestionCard', // DEBUG
        'relative flex flex-1 flex-col overflow-hidden',
        className,
      )}
    >
      <CardHeader
        className={cn(
          isDev && '__EditQuestionCard_Header', // DEBUG
          'item-start flex flex-col gap-4 lg:flex-row',
        )}
      >
        <div
          className={cn(
            isDev && '__ManageTopicQuestionsListCard_TitleWrapper', // DEBUG
            'flex flex-1 flex-col justify-center gap-2 overflow-hidden',
          )}
        >
          <QuestionsBreadcrumbs
            className={cn(
              isDev && '__ManageTopicQuestionsListCard_Breadcrumbs', // DEBUG
            )}
            scope={manageScope}
            isLoading={!topic || !question}
            topic={topic}
            question={question}
          />
        </div>
        <Toolbar
          {...props}
          goBack={goBack}
          toolbarPortalRef={setToolbarPortalNode}
          isLoading={isQuestionLoadingOverall}
        />
      </CardHeader>
      <CardContent
        className={cn(
          isDev && '__EditQuestionCard_Content', // DEBUG
          'relative flex flex-1 flex-col overflow-hidden px-0',
        )}
      >
        {questionFormContent}
      </CardContent>
    </Card>
  );
}
