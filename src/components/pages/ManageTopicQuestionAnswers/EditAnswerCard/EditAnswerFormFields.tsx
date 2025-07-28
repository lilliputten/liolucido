'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';

import { TPropsWithChildren } from '@/shared/types/generic';
import { cn } from '@/lib/utils';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { isDev } from '@/constants';
import { TAnswer } from '@/features/answers/types';

import { TFormData } from './types';

interface TEditAnswerFormFieldsProps {
  answer: TAnswer;
  isSubmitEnabled?: boolean;
  isPending?: boolean;
  onCancel?: (ev: React.MouseEvent) => void;
  form: UseFormReturn<TFormData>;
  className?: string;
}

function FormHint({ children }: { children?: React.ReactNode }) {
  if (!children) {
    return null;
  }
  return <div className="relative text-sm opacity-20">{children}</div>;
}

function FormSection({ children }: TPropsWithChildren) {
  return (
    <div
      className={cn(
        isDev && '__EditAnswerFormFields_FormSection', // DEBUG
        'flex w-full flex-1 flex-col gap-6 py-2 md:w-[45%]',
      )}
    >
      {children}
    </div>
  );
}

export function EditAnswerFormFields(props: TEditAnswerFormFieldsProps) {
  const { className, form } = props;
  // Create unique keys for labels
  const textKey = React.useId();
  return (
    <div className={cn('flex w-full flex-col gap-6 px-6 py-2 md:flex-row', className)}>
      <FormSection>
        <FormField
          name="text"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-4">
              <Label htmlFor={textKey}>Answer Text</Label>
              <FormControl>
                <Textarea
                  id={textKey}
                  className="flex-1"
                  placeholder="Answer Text"
                  rows={5}
                  {...field}
                />
              </FormControl>
              <FormHint>A answer text.</FormHint>
              <FormMessage />
            </FormItem>
          )}
        />
      </FormSection>
    </div>
  );
}
