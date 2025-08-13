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
}

export function ViewAnswerContentActions(props: TViewAnswerContentActionsProps) {
  const { answer, goBack, handleDeleteAnswer } = props;
  const router = useRouter();
  const answersContext = useAnswersContext();
  return (
    <>
      <Button variant="ghost" size="sm" onClick={goBack} className="gap-2" disabled={!goBack}>
        <Icons.ArrowLeft className="size-4" />
        <span>Back</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push(`${answersContext.routePath}/${answer.id}/edit`)}
        className="gap-2"
      >
        <Icons.edit className="size-4" />
        <span>Edit</span>
      </Button>
      <Button variant="destructive" size="sm" onClick={handleDeleteAnswer} className="gap-2">
        <Icons.trash className="size-4" />
        <span>Delete Answer</span>
      </Button>
    </>
  );
}
