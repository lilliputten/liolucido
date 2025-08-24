'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Icons } from '@/components/shared/icons';
import { useAnswersContext } from '@/contexts/AnswersContext';
import { TAnswer } from '@/features/answers/types';

export interface TViewAnswerContentActionsProps {
  answer: TAnswer;
  isPending?: boolean;
  goBack?: (ev: React.MouseEvent) => void;
  handleDeleteAnswer: () => void;
  handleAddAnswer?: () => void;
}

export function ViewAnswerContentActions(props: TViewAnswerContentActionsProps) {
  const { answer, goBack, handleDeleteAnswer, handleAddAnswer } = props;
  const router = useRouter();
  const answersContext = useAnswersContext();
  return (
    <>
      <Button variant="ghost" size="sm" onClick={goBack} className="gap-2" disabled={!goBack}>
        <Icons.ArrowLeft className="hidden size-4 opacity-50 sm:flex" />
        <span>Back</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push(`${answersContext.routePath}/${answer.id}/edit`)}
        className="gap-2"
      >
        <Icons.edit className="hidden size-4 opacity-50 sm:flex" />
        <span>Edit</span>
      </Button>
      {handleAddAnswer && (
        <Button variant="ghost" size="sm" onClick={handleAddAnswer} className="flex gap-2">
          <Icons.add className="hidden size-4 opacity-50 sm:flex" />
          <span>
            Add <span className="hidden sm:inline-flex">New Answer</span>
          </span>
        </Button>
      )}
      <Button variant="destructive" size="sm" onClick={handleDeleteAnswer} className="gap-2">
        <Icons.trash className="hidden size-4 opacity-50 sm:flex" />
        <span>
          Delete <span className="hidden sm:inline-flex">Answer</span>
        </span>
      </Button>
    </>
  );
}
