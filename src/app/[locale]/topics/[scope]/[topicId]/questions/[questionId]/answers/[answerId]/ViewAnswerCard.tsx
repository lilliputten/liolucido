'use client';

import React from 'react';

import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { TActionMenuItem } from '@/components/dashboard/DashboardActions';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import * as Icons from '@/components/shared/Icons';
import { isDev } from '@/constants';
import { useAnswersBreadcrumbsItems } from '@/features/answers/components/AnswersBreadcrumbs';
import { TAvailableAnswer } from '@/features/answers/types';
import { TAvailableQuestion } from '@/features/questions/types';
import { TAvailableTopic } from '@/features/topics/types';
import { useGoBack, useGoToTheRoute } from '@/hooks';
import { useManageTopicsStore } from '@/stores/ManageTopicsStoreProvider';

import { ViewAnswerContent } from './ViewAnswerContent';

interface TViewAnswerCardProps {
  topic: TAvailableTopic;
  question: TAvailableQuestion;
  answer: TAvailableAnswer;
}

export function ViewAnswerCard(props: TViewAnswerCardProps) {
  const { topic, question, answer } = props;
  const { manageScope } = useManageTopicsStore();

  // Calculate paths...
  const topicsListRoutePath = `/topics/${manageScope}`;
  const topicRoutePath = `${topicsListRoutePath}/${topic.id}`;
  const questionsListRoutePath = `${topicRoutePath}/questions`;
  const questionRoutePath = `${questionsListRoutePath}/${question.id}`;
  const answersListRoutePath = `${questionRoutePath}/answers`;
  // const answerRoutePath = `${answersListRoutePath}/${answer.id}`;

  const goToTheRoute = useGoToTheRoute();
  const goBack = useGoBack(answersListRoutePath);

  const actions: TActionMenuItem[] = React.useMemo(
    () => [
      {
        id: 'Back',
        content: 'Back',
        variant: 'ghost',
        icon: Icons.ArrowLeft,
        visibleFor: 'sm',
        disabled: !goBack,
        onClick: goBack,
      },
      {
        id: 'Edit',
        content: 'Edit',
        variant: 'ghost',
        icon: Icons.Edit,
        visibleFor: 'lg',
        onClick: () => goToTheRoute(`${answersListRoutePath}/${answer.id}/edit`),
      },
      {
        id: 'Add New Answer',
        content: 'Add New Answer',
        variant: 'ghost',
        icon: Icons.Add,
        visibleFor: 'xl',
        onClick: () => goToTheRoute(`${answersListRoutePath}/add`),
      },
      {
        id: 'Delete Answer',
        content: 'Delete Answer',
        variant: 'destructive',
        icon: Icons.Trash,
        visibleFor: 'xl',
        onClick: () =>
          goToTheRoute(`${answersListRoutePath}/delete?answerId=${answer.id}&from=ViewAnswerCard`),
      },
    ],
    [goBack, goToTheRoute, answersListRoutePath, answer.id],
  );

  const breadcrumbs = useAnswersBreadcrumbsItems({
    scope: manageScope,
    isLoading: !topic || !question || !answer,
    topic: topic,
    question: question,
    answer: answer,
    inactiveLast: true,
  });

  return (
    <>
      <DashboardHeader
        heading="View Answer"
        className={cn(
          isDev && '__ViewQuestionCard_DashboardHeader', // DEBUG
          'mx-6',
        )}
        breadcrumbs={breadcrumbs}
        actions={actions}
      />
      <Card
        className={cn(
          isDev && '__ViewQuestionCard_Card', // DEBUG
          'relative mx-6 flex flex-1 flex-col overflow-hidden py-6 xl:col-span-2',
        )}
      >
        <ViewAnswerContent topic={topic} question={question} answer={answer} />
      </Card>
    </>
  );
}
