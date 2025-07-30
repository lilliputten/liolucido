'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Icons } from '@/components/shared/icons';
import { useQuestionsContext } from '@/contexts/QuestionsContext';
import { TQuestion } from '@/features/questions/types';

export interface TViewQuestionContentActionsProps {
  question: TQuestion;
  isPending?: boolean;
  goBack?: (ev: React.MouseEvent) => void;
  handleDeleteQuestion: () => void;
}

export function ViewQuestionContentActions(props: TViewQuestionContentActionsProps) {
  const { question, goBack, handleDeleteQuestion } = props;
  const router = useRouter();
  const questionsContext = useQuestionsContext();
  return (
    <>
      <Button variant="ghost" size="sm" onClick={goBack} className="gap-2" disabled={!goBack}>
        <Icons.arrowLeft className="size-4" />
        <span>Back</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push(`${questionsContext.routePath}/${question.id}/edit`)}
        className="gap-2"
      >
        <Icons.edit className="size-4" />
        <span>Edit</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push(`${questionsContext.routePath}/${question.id}/answers`)}
        className="gap-2"
      >
        <Icons.answers className="size-4" />
        <span>Answers</span>
      </Button>
      <Button variant="destructive" size="sm" onClick={handleDeleteQuestion} className="gap-2">
        <Icons.trash className="size-4" />
        <span>Delete</span>
      </Button>
    </>
  );
}
