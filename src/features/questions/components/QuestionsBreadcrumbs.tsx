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
import { useQuestionsContext } from '@/contexts/QuestionsContext/QuestionsContext';
import { topicsRoutes, TTopicsManageScopeId } from '@/contexts/TopicsContext';
import { TQuestion, TQuestionId } from '@/features/questions/types';
import {
  TTopicsBreadcrumbsProps,
  useTopicsBreadcrumbsItems,
  useTopicsScopeBreadcrumbsItems,
} from '@/features/topics/components/TopicsBreadcrumbs';
import { TTopic } from '@/features/topics/types';

interface TScopeBreadcrumbsProps {
  scope: TTopicsManageScopeId;
  topic?: TTopic; // The topic is required by might by undefined while loading, then display skeleton
  question?: TQuestion;
  lastItem?: TBreadcrumbsItemProps | BreadcrumbsItem;
  inactiveLast?: boolean;
  isLoading?: boolean;
}
export function useQuestionsScopeBreadcrumbsItems(props: TScopeBreadcrumbsProps) {
  const { scope, topic, question, lastItem, isLoading } = props;
  const topicsListRoutePath = topicsRoutes[scope];
  const topicRoutePath = topic && `${topicsListRoutePath}/${topic.id}`;
  const questionsListRoutePath = topicRoutePath && `${topicRoutePath}/questions`;
  const questionRoutePath =
    question && questionsListRoutePath && `${questionsListRoutePath}/${question.id}`;
  // TODO: Use i18n translations
  const listTitle = capitalizeString(scope) + ' Questions' + (isDev ? '*' : '');
  const topicItems = useTopicsScopeBreadcrumbsItems({ scope, topic });
  if (isLoading) {
    return [];
  }
  const items = filterOutEmpties<TBreadcrumbsItemProps>([
    { link: questionsListRoutePath, content: listTitle },
    question && {
      link: questionRoutePath,
      content: truncateMarkdown(question.text, 50),
    },
    lastItem,
  ]);
  return [...topicItems, ...items];
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
        {[...Array(3)].map((_, i) => (
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
