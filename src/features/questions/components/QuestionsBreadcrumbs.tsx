'use client';

import React from 'react';

import { TPropsWithClassName } from '@/shared/types/generic';
import { filterOutEmpties } from '@/lib/helpers/arrays';
import { truncateString } from '@/lib/helpers/strings';
import { cn } from '@/lib/utils';
import { Breadcrumbs, TBreadcrumbsItemProps } from '@/components/layout/Breadcrumbs';
import { isDev } from '@/constants';
import { useQuestionsContext } from '@/contexts/QuestionsContext/QuestionsContext';
import { TQuestion, TQuestionId } from '@/features/questions/types';
import {
  TTopicsBreadcrumbsProps,
  useTopicsBreadcrumbsItems,
} from '@/features/topics/components/TopicsBreadcrumbs';

export interface TQuestionsBreadcrumbsProps extends TTopicsBreadcrumbsProps {
  questionId?: TQuestionId;
  inactiveQuestions?: boolean;
  inactiveQuestion?: boolean;
}

export function useQuestionsBreadcrumbsItems(props: TQuestionsBreadcrumbsProps) {
  // const { manageScope } = useManageTopicsStore();
  // const rootRoutePath = `/topics/${manageScope}`;

  const { questionId, inactiveQuestions, inactiveQuestion, ...rest } = props;
  const questionsContext = useQuestionsContext();
  const { questions, topicId, routePath } = questionsContext;
  const topicItems = useTopicsBreadcrumbsItems({ topicId, ...rest });
  const question: TQuestion | undefined = React.useMemo(
    () => (questionId ? questions.find(({ id }) => id === questionId) : undefined),
    [questions, questionId],
  );
  const items = filterOutEmpties<TBreadcrumbsItemProps>([
    { link: inactiveQuestions ? undefined : routePath, content: 'Questions' },
    !!question && {
      link: inactiveQuestion ? undefined : `${routePath}/${question.id}`,
      content: truncateString(question.text, 20),
    },
  ]);
  return [...topicItems, ...items];
}

export function QuestionsBreadcrumbs(props: TQuestionsBreadcrumbsProps & TPropsWithClassName) {
  const { className, ...rest } = props;
  const items = useQuestionsBreadcrumbsItems(rest);
  return (
    <Breadcrumbs
      className={cn(
        isDev && '__QuestionsBreadcrumbs', // DEBUG
        className,
      )}
      items={items}
    />
  );
}
