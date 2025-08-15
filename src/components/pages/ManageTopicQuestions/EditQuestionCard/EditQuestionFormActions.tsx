'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/shared/icons';
import { TQuestion } from '@/features/questions/types';

import { TFormData } from './types';

interface TProps {
  question: TQuestion;
  isSubmitEnabled?: boolean;
  isPending?: boolean;
  onCancel?: (ev: React.MouseEvent) => void;
  form: UseFormReturn<TFormData>;
  onSubmit: (data: TFormData) => void;
  handleDeleteQuestion: () => void;
  handleAddQuestion?: () => void;
}

export function EditQuestionFormActions(props: TProps) {
  const {
    isSubmitEnabled,
    isPending,
    onCancel,
    handleDeleteQuestion,
    handleAddQuestion,
    form,
    onSubmit,
  } = props;
  const { isDirty } = form.formState;
  const Icon = isPending ? Icons.spinner : Icons.check;
  const buttonText = isPending ? 'Saving' : 'Save';
  const handleSubmit = form.handleSubmit(onSubmit);
  return (
    <>
      {!isDirty && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="gap-2"
          disabled={isDirty || !onCancel}
        >
          <Icons.ArrowLeft className="size-4 opacity-50" />
          <span>Back</span>
        </Button>
      )}
      {isDirty && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => form.reset()}
          className="gap-2"
          disabled={!isDirty}
        >
          <Icons.close className="size-4 opacity-50" />
          <span>
            Reset <span className="hidden sm:inline-flex">changes</span>
          </span>
        </Button>
      )}
      {handleAddQuestion && (
        <Button variant="ghost" size="sm" onClick={handleAddQuestion} className="flex gap-2 px-4">
          <Icons.add className="size-4 opacity-50" />
          <span>
            Add <span className="hidden sm:inline-flex">New Question</span>
          </span>
        </Button>
      )}
      <Button variant="destructive" size="sm" onClick={handleDeleteQuestion} className="gap-2">
        <Icons.trash className="size-4 opacity-50" />
        <span>
          Delete <span className="hidden sm:inline-flex">Question</span>
        </span>
      </Button>
      <Button
        type="button"
        size="sm"
        variant={isSubmitEnabled ? 'success' : 'disable'}
        disabled={!isSubmitEnabled}
        className="gap-2"
        onClick={handleSubmit}
      >
        <Icon className={cn('size-4', isPending && 'animate-spin')} /> <span>{buttonText}</span>
      </Button>
    </>
  );
}
