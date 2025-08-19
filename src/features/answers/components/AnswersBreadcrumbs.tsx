'use client';

import React from 'react';

import { TPropsWithClassName } from '@/shared/types/generic';
import { filterOutEmpties } from '@/lib/helpers/arrays';
import { truncateString } from '@/lib/helpers/strings';
import { cn } from '@/lib/utils';
import { Breadcrumbs, TBreadcrumbsItemProps } from '@/components/layout/Breadcrumbs';
import { isDev } from '@/constants';
import { useAnswersContext } from '@/contexts/AnswersContext/AnswersContext';
import { TAnswer, TAnswerId } from '@/features/answers/types';
import {
  TQuestionsBreadcrumbsProps,
  useQuestionsBreadcrumbsItems,
} from '@/features/questions/components/QuestionsBreadcrumbs';

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
