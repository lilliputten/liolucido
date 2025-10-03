'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import * as Icons from '@/components/shared/Icons';
import { TAnswer } from '@/features/answers/types';

import { TFormData } from './types';

interface TProps {
  answer: TAnswer;
  isSubmitEnabled?: boolean;
  isPending?: boolean;
  onCancel?: (ev: React.MouseEvent) => void;
  form: UseFormReturn<TFormData>;
  onSubmit: (data: TFormData) => void;
  handleDeleteAnswer: () => void;
  handleAddAnswer?: () => void;
}

export function EditAnswerFormActions(props: TProps) {
  const {
    isSubmitEnabled,
    isPending,
    onCancel,
    handleDeleteAnswer,
    handleAddAnswer,
    form,
    onSubmit,
  } = props;
  const { isDirty } = form.formState;
  const Icon = isPending ? Icons.Spinner : Icons.Check;
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
          <Icons.ArrowLeft className="hidden size-4 opacity-50 sm:flex" />
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
          <Icons.Close className="hidden size-4 opacity-50 sm:flex" />
          <span>Reset changes</span>
        </Button>
      )}
      {handleAddAnswer && (
        <Button variant="ghost" size="sm" onClick={handleAddAnswer} className="flex gap-2">
          <Icons.Add className="hidden size-4 opacity-50 sm:flex" />
          <span>
            Add <span className="hidden sm:inline-flex">New Answer</span>
          </span>
        </Button>
      )}
      <Button variant="destructive" size="sm" onClick={handleDeleteAnswer} className="gap-2">
        <Icons.Trash className="hidden size-4 opacity-50 sm:flex" />
        <span>Delete Answer</span>
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
