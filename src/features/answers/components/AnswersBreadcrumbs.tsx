'use client';

import React from 'react';

import { TPropsWithClassName } from '@/shared/types/generic';
import { truncateMarkdown } from '@/lib/helpers';
import { filterOutEmpties } from '@/lib/helpers/arrays';
import { capitalizeString, truncateString } from '@/lib/helpers/strings';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Breadcrumbs,
  BreadcrumbsItem,
  TBreadcrumbsItemProps,
} from '@/components/layout/Breadcrumbs';
import { isDev } from '@/constants';
import { useAnswersContext } from '@/contexts/AnswersContext/AnswersContext';
import { topicsRoutes, TTopicsManageScopeId } from '@/contexts/TopicsContext';
import { TAnswer, TAnswerId } from '@/features/answers/types';
import {
  TQuestionsBreadcrumbsProps,
  useQuestionsBreadcrumbsItems,
  useQuestionsScopeBreadcrumbsItems,
} from '@/features/questions/components/QuestionsBreadcrumbs';
import { TQuestion } from '@/features/questions/types';
import { TTopic } from '@/features/topics/types';

interface TScopeBreadcrumbsProps {
  scope: TTopicsManageScopeId;
  topic: TTopic; // The topic is required by might by undefined while loading, then display skeleton
  question: TQuestion;
  answer?: TAnswer;
  lastItem?: TBreadcrumbsItemProps | BreadcrumbsItem;
  inactiveLast?: boolean;
  isLoading?: boolean;
}
export function useAnswersScopeBreadcrumbsItems(props: TScopeBreadcrumbsProps) {
  const { scope, topic, question, answer, lastItem, isLoading } = props;
  const topicsListRoutePath = topicsRoutes[scope];
  const topicRoutePath = topic && `${topicsListRoutePath}/${topic.id}`;
  const questionsListRoutePath = topicRoutePath && `${topicRoutePath}/questions`;
  const questionRoutePath = questionsListRoutePath && `${questionsListRoutePath}/${question.id}`;
  const answersListRoutePath = questionRoutePath && `${questionRoutePath}/answers`;
  const answerRoutePath = answer && answersListRoutePath && `${answersListRoutePath}/${answer.id}`;
  // TODO: Use i18n translations
  const listTitle = capitalizeString(scope) + ' Answers' + (isDev ? '*' : '');
  const questionItems = useQuestionsScopeBreadcrumbsItems({ scope, topic, question });
  if (isLoading) {
    return [];
  }
  const items = filterOutEmpties<TBreadcrumbsItemProps>([
    { link: answersListRoutePath, content: listTitle },
    answer && {
      link: answerRoutePath,
      content: truncateMarkdown(answer.text, 50),
    },
    lastItem,
  ]);
  return [...questionItems, ...items];
}

export function QuestionsScopeBreadcrumbs(props: TScopeBreadcrumbsProps & TPropsWithClassName) {
  const { className, inactiveLast, isLoading } = props;
  const items = useQuestionsScopeBreadcrumbsItems(props);
  if (isLoading) {
    return (
      <div
        className={cn(
          isDev && '__QuestionsScopeBreadcrumbs_Skeleton', // DEBUG
          'flex gap-2',
        )}
      >
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-6 w-32 rounded" />
        ))}
      </div>
    );
  }
  if (inactiveLast && items.length) {
    const lastIdx = items.length - 1;
    if (items[lastIdx].link) {
      items[lastIdx] = { ...items[lastIdx], link: undefined };
    }
  }
  return (
    <Breadcrumbs
      className={cn(
        isDev && '__QuestionsScopeBreadcrumbs', // DEBUG
        className,
      )}
      items={items}
    />
  );
}

// Below items are used only with `useQuestionsContext`
export interface TAnswersBreadcrumbsProps extends TQuestionsBreadcrumbsProps {
  answerId?: TAnswerId;
  inactiveAnswers?: boolean;
  inactiveAnswer?: boolean;
}

export function useAnswersBreadcrumbsItems(props: TAnswersBreadcrumbsProps) {
  const { answerId, inactiveAnswers, inactiveAnswer, ...rest } = props;
  const answersContext = useAnswersContext();
  const { answers, questionId, routePath } = answersContext;
  const questionItems = useQuestionsBreadcrumbsItems({ questionId, ...rest });
  const answer: TAnswer | undefined = React.useMemo(
    () => (answerId ? answers.find(({ id }) => id === answerId) : undefined),
    [answers, answerId],
  );
  const items = filterOutEmpties<TBreadcrumbsItemProps>([
    { link: inactiveAnswers ? undefined : routePath, content: 'Answers' },
    !!answer && {
      link: inactiveAnswer ? undefined : `${routePath}/${answer.id}`,
      content: truncateString(answer.text, 20),
    },
  ]);
  return [...questionItems, ...items];
}

export function AnswersBreadcrumbs(props: TAnswersBreadcrumbsProps & TPropsWithClassName) {
  const { className, ...rest } = props;
  const items = useAnswersBreadcrumbsItems(rest);
  return (
    <Breadcrumbs
      className={cn(
        isDev && '__AnswersBreadcrumbs', // DEBUG
        className,
      )}
      items={items}
    />
  );
}
