'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/shared/icons';
import { TSettings } from '@/features/settings/types';

import { TFormData } from './types';

interface TProps {
  settings: TSettings;
  isSubmitEnabled?: boolean;
  isPending?: boolean;
  onCancel?: (ev: React.MouseEvent) => void;
  form: UseFormReturn<TFormData>;
  onSubmit: (data: TFormData) => void;
}

export function SettingsFormActions(props: TProps) {
  const { isSubmitEnabled, isPending, onCancel, form, onSubmit } = props;
  const { isDirty } = form.formState;
  const Icon = isPending ? Icons.spinner : Icons.check;
  const buttonText = isPending ? 'Saving' : 'Save';
  const handleSubmit = form.handleSubmit(onSubmit);
  return (
    <>
      {!isDirty && onCancel && (
        <Button variant="ghost" size="sm" className="gap-2" disabled={isDirty} onClick={onCancel}>
          <Icons.arrowLeft className="size-4" />
          <span>Back</span>
        </Button>
      )}
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
      {isDirty && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => form.reset()}
          className="gap-2"
          disabled={!isDirty}
        >
          <Icons.close className="size-4" />
          <span>Reset changes</span>
        </Button>
      )}
    </>
  );
}
