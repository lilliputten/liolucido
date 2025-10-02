'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Icons } from '@/components/shared/Icons';
import { TTopic } from '@/features/topics/types';

import { TFormData } from './types';

interface TProps {
  topic: TTopic;
  isSubmitEnabled?: boolean;
  isPending?: boolean;
  onCancel?: (ev: React.MouseEvent) => void;
  form: UseFormReturn<TFormData>;
  onSubmit: (data: TFormData) => void;
  handleDeleteTopic: () => void;
}

export function EditTopicFormActions(props: TProps) {
  const { isSubmitEnabled, isPending, onCancel, form, onSubmit, handleDeleteTopic } = props;
  const { isDirty } = form.formState;
  const Icon = isPending ? Icons.spinner : Icons.check;
  const buttonText = isPending ? 'Saving' : 'Save';
  const handleSubmit = form.handleSubmit(onSubmit);
  return (
    <>
      {!isDirty && (
        <Button variant="ghost" size="sm" onClick={onCancel} className="gap-2" disabled={isDirty}>
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
          <Icons.close className="hidden size-4 opacity-50 sm:flex" />
          <span>Reset changes</span>
        </Button>
      )}
      <Button variant="destructive" size="sm" onClick={handleDeleteTopic} className="gap-2">
        <Icons.trash className="hidden size-4 opacity-50 sm:flex" />
        <span>Delete Topic</span>
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
