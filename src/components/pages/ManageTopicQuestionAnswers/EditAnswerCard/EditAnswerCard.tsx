'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { TPropsWithClassName } from '@/shared/types/generic';
import { generateArray } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PageError } from '@/components/shared/PageError';
import { isDev } from '@/constants';
import { useAnswersContext } from '@/contexts/AnswersContext';
import {
  AnswersBreadcrumbs,
  AnswersScopeBreadcrumbs,
} from '@/features/answers/components/AnswersBreadcrumbs';
import { TAnswer, TAnswerId } from '@/features/answers/types';
import { TQuestionId } from '@/features/questions/types';
import { TTopicId } from '@/features/topics/types';
import {
  useAvailableAnswerById,
  useAvailableAnswers,
  useAvailableQuestionById,
  useAvailableTopicById,
  useGoBack,
  useGoToTheRoute,
} from '@/hooks';
import { useManageTopicsStore } from '@/stores/ManageTopicsStoreProvider';

import { topicAnswerDeletedEventId } from '../DeleteAnswerModal';
import { EditAnswerForm } from './EditAnswerForm';

interface TEditAnswerCardProps extends TPropsWithClassName {
  topicId: TTopicId;
  questionId: TQuestionId;
  answerId: TAnswerId;
}
type TToolbarProps = {
  goBack: () => void;
  toolbarPortalRef: (node: HTMLDivElement | null) => void;
  isLoading?: boolean;
};

function Toolbar({ toolbarPortalRef, isLoading }: TToolbarProps) {
  return (
    <div
      ref={toolbarPortalRef}
      className={cn(
        isDev && '__EditAnswerCard_Toolbar', // DEBUG
        'flex flex-wrap gap-2',
      )}
    >
      {isLoading && generateArray(3).map((i) => <Skeleton key={i} className="h-9 w-24 rounded" />)}
      {/* // Example
      <Button disabled variant="ghost" size="sm" className="flex gap-2">
        <Link href="#" className="flex items-center gap-2">
          <Icons.refresh className="hidden size-4 sm:block" />
          <span>Refresh</span>
        </Link>
      </Button>
      */}
    </div>
  );
}

export function EditAnswerCard(props: TEditAnswerCardProps) {
  const { manageScope } = useManageTopicsStore();

  const { className, answerId, topicId, questionId } = props;
  const [toolbarPortalNode, setToolbarPortalNode] = React.useState<HTMLDivElement | null>(null);
  const [hasDeleted, setHasDeleted] = React.useState(false);

  const router = useRouter();

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

  const availableAnswersQuery = useAvailableAnswers({ questionId });
  const {
    // ...
    queryKey: availableAnswersQueryKey,
    queryProps: availableAnswersQueryProps,
  } = availableAnswersQuery;

  // Calculate paths...
  const topicsListRoutePath = `/topics/${manageScope}`;
  const topicRoutePath = `${topicsListRoutePath}/${topicId}`;
  const questionsListRoutePath = `${topicRoutePath}/questions`;
  const questionRoutePath = `${questionsListRoutePath}/${questionId}`;
  const answersListRoutePath = `${questionRoutePath}/answers`;
  // const answerRoutePath = `${answersListRoutePath}/${answerId}`;

  const availableAnswerQuery = useAvailableAnswerById({
    id: answerId,
    availableAnswersQueryKey,
    includeQuestion: availableAnswersQueryProps.includeQuestion,
  });
  const { answer, isFetched: isAnswerFetched, isLoading: isAnswerLoading } = availableAnswerQuery;
  const isAnswerLoadingOverall = !answer && (!isAnswerFetched || isAnswerLoading);

  const goToTheRoute = useGoToTheRoute();
  const goBack = useGoBack(answersListRoutePath);

  // Add Answer Modal
  const handleAddAnswer = React.useCallback(() => {
    router.push(`${answersListRoutePath}/add`);
  }, [answersListRoutePath, router]);

  // Delete Answer Modal
  const handleDeleteAnswer = React.useCallback(() => {
    const url = `${answersListRoutePath}/delete?answerId=${answerId}`;
    goToTheRoute(url);
  }, [answerId, answersListRoutePath, goToTheRoute]);

  // Watch if the answer has been deleted
  React.useEffect(() => {
    const handleAnswerDeleted = (event: CustomEvent<TAnswer>) => {
      const { id } = event.detail;
      // Make sure the event is for this topic
      if (answerId === id) {
        setHasDeleted(true);
      }
    };
    window.addEventListener(topicAnswerDeletedEventId, handleAnswerDeleted as EventListener);
    return () => {
      window.removeEventListener(topicAnswerDeletedEventId, handleAnswerDeleted as EventListener);
    };
  }, [answerId]);

  // Effect:hasDeleted
  React.useEffect(() => {
    if (hasDeleted) {
      goBack();
    }
  }, [goBack, hasDeleted]);

  const answerFormContent = isAnswerLoadingOverall ? (
    <div
      className={cn(
        isDev && '__EditAnswerCard_Form_Skeleton', // DEBUG
        'flex size-full flex-1 flex-col gap-4 p-6',
      )}
    >
      <Skeleton className="h-8 w-full rounded-lg" />
      {[...Array(1)].map((_, i) => (
        <Skeleton key={i} className="h-20 w-full rounded-lg" />
      ))}
    </div>
  ) : answer ? (
    <EditAnswerForm
      className={cn(
        isDev && '__EditAnswerCard_Form_Content', // DEBUG
      )}
      availableAnswersQuery={availableAnswersQuery}
      answer={answer}
      onCancel={goBack}
      toolbarPortalRoot={toolbarPortalNode}
      handleDeleteAnswer={handleDeleteAnswer}
      handleAddAnswer={handleAddAnswer}
    />
  ) : (
    <PageError
      className={cn(
        isDev && '__EditAnswerCard_Form_Error', // DEBUG
      )}
      title="No answer found"
    />
  );

  return (
    <Card
      className={cn(
        isDev && '__EditAnswerCard', // DEBUG
        'relative flex flex-1 flex-col overflow-hidden',
        className,
      )}
    >
      <CardHeader
        className={cn(
          isDev && '__EditAnswerCard_Header', // DEBUG
          'item-start flex flex-col gap-4', // lg:flex-row',
        )}
      >
        <div
          className={cn(
            isDev && '__EditAnswerCard_TitleWrapper', // DEBUG
            'flex flex-1 flex-col justify-center gap-2 overflow-hidden',
          )}
        >
          <AnswersScopeBreadcrumbs
            className={cn(
              isDev && '__EditAnswerCard_Breadcrumbs', // DEBUG
            )}
            scope={manageScope}
            isLoading={!topic || !question || !answer}
            topic={topic}
            question={question}
            answer={answer}
            // inactiveLast
          />
        </div>
        <Toolbar
          {...props}
          goBack={goBack}
          toolbarPortalRef={setToolbarPortalNode}
          isLoading={isAnswerLoadingOverall}
        />
      </CardHeader>
      <CardContent
        className={cn(
          isDev && '__EditAnswerCard_Content', // DEBUG
          'relative flex flex-1 flex-col overflow-hidden px-0',
        )}
      >
        {answerFormContent}
      </CardContent>
    </Card>
  );
}
