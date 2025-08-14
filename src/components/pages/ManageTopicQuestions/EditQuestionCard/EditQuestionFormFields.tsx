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
import { MarkdownHint } from '@/components/blocks/MarkdownHint';
import { isDev } from '@/constants';
import { TQuestion } from '@/features/questions/types';

import { TFormData } from './types';

interface TEditQuestionFormFieldsProps {
  question: TQuestion;
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
        isDev && '__EditQuestionFormFields_FormSection', // DEBUG
        'flex w-full flex-1 flex-col gap-6 py-2 md:w-[45%]',
      )}
    >
      {children}
    </div>
  );
}

export function EditQuestionFormFields(props: TEditQuestionFormFieldsProps) {
  const { className, form } = props;
  // Create unique keys for labels
  const textKey = React.useId();
  const answersCountRandomKey = React.useId();
  const answersCountMinKey = React.useId();
  const answersCountMaxKey = React.useId();
  return (
    <div className={cn('flex w-full flex-col gap-6 px-6 py-2 md:flex-row', className)}>
      <FormSection>
        {/* text */}
        <FormField
          name="text"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-4">
              <Label htmlFor={textKey}>Question Text</Label>
              <FormControl>
                <Textarea
                  id={textKey}
                  className="flex-1"
                  placeholder="Question Text"
                  rows={5}
                  {...field}
                />
              </FormControl>
              <FormHint>
                A question Text. <MarkdownHint />
              </FormHint>
              <FormMessage />
            </FormItem>
          )}
        />
      </FormSection>
      <FormSection>
        <FormField
          name="answersCountRandom"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-4">
              <Label htmlFor={answersCountRandomKey}>Use random questions count?</Label>
              <FormControl>
                <Switch
                  id={answersCountRandomKey}
                  checked={!!field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormHint>
                Allow to generate random number of answers for questions (if it's not overidden in
                the question settings).
              </FormHint>
              <FormMessage />
            </FormItem>
          )}
        />
        {!!form.watch('answersCountRandom') && (
          <>
            <FormField
              name="answersCountMin"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex w-full flex-col gap-4">
                  <Label htmlFor={answersCountMinKey}>Minimal questions count</Label>
                  <FormControl>
                    <Input
                      id={answersCountMinKey}
                      type="number"
                      placeholder="Minimal questions count"
                      {...field}
                      onChange={(ev) => field.onChange(Number(ev.target.value) || '')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="answersCountMax"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex w-full flex-col gap-4">
                  <Label htmlFor={answersCountMaxKey}>Maximal questions count</Label>
                  <FormControl>
                    <Input
                      id={answersCountMaxKey}
                      type="number"
                      placeholder="Maximal questions count"
                      {...field}
                      onChange={(ev) => field.onChange(Number(ev.target.value) || '')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
      </FormSection>
    </div>
  );
}
