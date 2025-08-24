'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/shared/icons';
import { isDev } from '@/constants';
import { useQuestionsContext } from '@/contexts/QuestionsContext';
import { TQuestion } from '@/features/questions/types';

export interface TViewQuestionContentActionsProps {
  className?: string;
  question: TQuestion;
  isPending?: boolean;
  goBack?: (ev: React.MouseEvent) => void;
  handleDeleteQuestion: () => void;
  handleAddQuestion?: () => void;
}

export function ViewQuestionContentActions(props: TViewQuestionContentActionsProps) {
  const { question, className, goBack, handleDeleteQuestion, handleAddQuestion } = props;
  const router = useRouter();
  const questionsContext = useQuestionsContext();
  return (
    <div
      className={cn(
        isDev && '__ViewQuestionContentActions', // DEBUG
        'flex flex-wrap items-center gap-4',
        className,
      )}
    >
      <Button variant="ghost" size="sm" onClick={goBack} className="gap-2" disabled={!goBack}>
        <Icons.ArrowLeft className="hidden size-4 opacity-50 sm:flex" />
        <span>Back</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push(`${questionsContext.routePath}/${question.id}/edit`)}
        className="gap-2"
      >
        <Icons.edit className="hidden size-4 opacity-50 sm:flex" />
        <span>Edit</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push(`${questionsContext.routePath}/${question.id}/answers`)}
        className="gap-2"
      >
        <Icons.answers className="hidden size-4 opacity-50 sm:flex" />
        <span>Answers</span>
      </Button>
      {handleAddQuestion && (
        <Button variant="ghost" size="sm" onClick={handleAddQuestion} className="flex gap-2 px-4">
          <Icons.add className="hidden size-4 opacity-50 sm:flex" />
          <span>
            Add <span className="hidden sm:inline-flex">New Question</span>
          </span>
        </Button>
      )}
      <Button variant="destructive" size="sm" onClick={handleDeleteQuestion} className="gap-2">
        <Icons.trash className="hidden size-4 opacity-50 sm:flex" />
        <span>Delete Question</span>
      </Button>
    </div>
  );
}
