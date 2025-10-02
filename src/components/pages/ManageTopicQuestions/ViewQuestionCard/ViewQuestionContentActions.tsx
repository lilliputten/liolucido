'use client';

import React from 'react';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Icons } from '@/components/shared/Icons';
import { isDev } from '@/constants';
import { TQuestion } from '@/features/questions/types';
import { useGoBack } from '@/hooks';
import { useManageTopicsStore } from '@/stores/ManageTopicsStoreProvider';

export interface TViewQuestionContentActionsProps {
  className?: string;
  question: TQuestion;
  isPending?: boolean;
}

export function ViewQuestionContentActions(props: TViewQuestionContentActionsProps) {
  const { manageScope } = useManageTopicsStore();
  const { question, className } = props;

  const { topicId } = question;

  const topicsListRoutePath = `/topics/${manageScope}`;
  const topicRoutePath = `${topicsListRoutePath}/${topicId}`;
  const questionsListRoutePath = `${topicRoutePath}/questions`;
  // const questionRoutePath = `${questionsListRoutePath}/${questionId}`;
  // const answersListRoutePath = `${questionRoutePath}/answers`;
  // const answerRoutePath = `${answersListRoutePath}/${answerId}`;

  const goBack = useGoBack(questionsListRoutePath);

  return (
    <div
      className={cn(
        isDev && '__ViewQuestionContentActions', // DEBUG
        'flex flex-wrap items-center gap-4',
        className,
      )}
    >
      <Button variant="ghost" size="sm" onClick={goBack} className="flex gap-2" disabled={!goBack}>
        <Icons.ArrowLeft className="hidden size-4 opacity-50 sm:flex" />
        <span>Back</span>
      </Button>
      <Button variant="ghost" size="sm">
        <Link href={`${questionsListRoutePath}/${question.id}/edit`} className="flex gap-2">
          <Icons.edit className="hidden size-4 opacity-50 sm:flex" />
          <span>Edit</span>
        </Link>
      </Button>
      <Button variant="ghost" size="sm">
        <Link href={`${questionsListRoutePath}/${question.id}/answers`} className="flex gap-2">
          <Icons.answers className="hidden size-4 opacity-50 sm:flex" />
          <span>Answers</span>
        </Link>
      </Button>
      <Button variant="ghost" size="sm">
        <Link href={`${questionsListRoutePath}/add`} className="flex gap-2">
          <Icons.add className="hidden size-4 opacity-50 sm:flex" />
          <span>
            Add <span className="hidden sm:inline-flex">New Question</span>
          </span>
        </Link>
      </Button>
      <Button variant="destructive" size="sm">
        <Link
          href={`${questionsListRoutePath}/delete?questionId=${question.id}&from=ViewQuestionCard`}
          className="flex gap-2"
        >
          <Icons.trash className="hidden size-4 opacity-50 sm:flex" />
          <span>Delete Question</span>
        </Link>
      </Button>
    </div>
  );
}
