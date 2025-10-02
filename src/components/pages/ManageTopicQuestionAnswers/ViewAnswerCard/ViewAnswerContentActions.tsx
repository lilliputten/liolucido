'use client';

import React from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/Button';
import { Icons } from '@/components/shared/Icons';
import { TAnswer } from '@/features/answers/types';
import { TQuestionId } from '@/features/questions/types';
import { TTopicId } from '@/features/topics/types';
import { useManageTopicsStore } from '@/stores/ManageTopicsStoreProvider';

export interface TViewAnswerContentActionsProps {
  topicId: TTopicId;
  questionId: TQuestionId;
  answer: TAnswer;
  isPending?: boolean;
  goBack?: (ev: React.MouseEvent) => void;
}

export function ViewAnswerContentActions(props: TViewAnswerContentActionsProps) {
  const { manageScope } = useManageTopicsStore();
  const { topicId, questionId, answer, goBack } = props;

  // Calculate paths...
  const topicsListRoutePath = `/topics/${manageScope}`;
  const topicRoutePath = `${topicsListRoutePath}/${topicId}`;
  const questionsListRoutePath = `${topicRoutePath}/questions`;
  const questionRoutePath = `${questionsListRoutePath}/${questionId}`;
  const answersListRoutePath = `${questionRoutePath}/answers`;
  // const answerRoutePath = `${answersListRoutePath}/${answerId}`;

  return (
    <>
      <Button variant="ghost" size="sm" onClick={goBack} className="gap-2" disabled={!goBack}>
        <Icons.ArrowLeft className="hidden size-4 opacity-50 sm:flex" />
        <span>Back</span>
      </Button>
      <Button variant="ghost" size="sm">
        <Link href={`${answersListRoutePath}/${answer.id}/edit`} className="flex gap-2">
          <Icons.edit className="hidden size-4 opacity-50 sm:flex" />
          <span>Edit</span>
        </Link>
      </Button>
      <Button variant="ghost" size="sm">
        <Link href={`${answersListRoutePath}/add`} className="flex gap-2">
          <Icons.add className="hidden size-4 opacity-50 sm:flex" />
          <span>
            Add <span className="hidden sm:inline-flex">New Answer</span>
          </span>
        </Link>
      </Button>
      <Button variant="destructive" size="sm">
        <Link
          href={`${answersListRoutePath}/delete?answerId=${answer.id}&from=ViewAnswerContentActions`}
          className="flex gap-2"
        >
          <Icons.trash className="hidden size-4 opacity-50 sm:flex" />
          <span>
            Delete <span className="hidden sm:inline-flex">Answer</span>
          </span>
        </Link>
      </Button>
    </>
  );
}
