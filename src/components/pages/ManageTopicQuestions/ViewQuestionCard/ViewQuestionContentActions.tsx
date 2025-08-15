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
  handleAddQuestion?: () => void;
}

export function ViewQuestionContentActions(props: TViewQuestionContentActionsProps) {
  const { question, goBack, handleDeleteQuestion, handleAddQuestion } = props;
  const router = useRouter();
  const questionsContext = useQuestionsContext();
  return (
    <>
      <Button variant="ghost" size="sm" onClick={goBack} className="gap-2" disabled={!goBack}>
        <Icons.ArrowLeft className="size-4 opacity-50" />
        <span>Back</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push(`${questionsContext.routePath}/${question.id}/edit`)}
        className="gap-2"
      >
        <Icons.edit className="size-4 opacity-50" />
        <span>Edit</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push(`${questionsContext.routePath}/${question.id}/answers`)}
        className="gap-2"
      >
        <Icons.answers className="size-4 opacity-50" />
        <span>Answers</span>
      </Button>
      {handleAddQuestion && (
        <Button variant="ghost" size="sm" onClick={handleAddQuestion} className="flex gap-2 px-4">
          <Icons.add className="hidden size-4 opacity-50 sm:block" />
          <span>
            Add <span className="hidden sm:inline-flex">New Question</span>
          </span>
        </Button>
      )}
      <Button variant="destructive" size="sm" onClick={handleDeleteQuestion} className="gap-2">
        <Icons.trash className="size-4 opacity-50" />
        <span>Delete Question</span>
      </Button>
    </>
  );
}
