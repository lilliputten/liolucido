'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';

import { TPropsWithChildren } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Switch } from '@/components/ui/Switch';
import { Textarea } from '@/components/ui/Textarea';
import { FormHint } from '@/components/blocks/FormHint';
import { MarkdownHint } from '@/components/blocks/MarkdownHint';
import * as Icons from '@/components/shared/Icons';
import { isDev } from '@/constants';
import { TTopic } from '@/features/topics/types';

import { TFormData } from './types';

interface TEditTopicFormFieldsProps {
  topic: TTopic;
  isSubmitEnabled?: boolean;
  isPending?: boolean;
  onCancel?: (ev: React.MouseEvent) => void;
  form: UseFormReturn<TFormData>;
  className?: string;
  selectLanguage: (ev: React.MouseEvent) => void;
}

function FormSection({ children }: TPropsWithChildren) {
  return (
    <div
      className={cn(
        isDev && '__EditTopicFormFields_FormSection', // DEBUG
        'flex w-full flex-1 flex-col gap-6 py-2 md:w-[45%]',
      )}
    >
      {children}
    </div>
  );
}

export function EditTopicFormFields(props: TEditTopicFormFieldsProps) {
  const { className, form, selectLanguage } = props;
  // Create unique keys for labels
  const nameKey = React.useId();
  const descriptionKey = React.useId();
  const isPublicKey = React.useId();
  const keywordsKey = React.useId();
  const langCodeKey = React.useId();
  const answersCountRandomKey = React.useId();
  const answersCountMinKey = React.useId();
  const answersCountMaxKey = React.useId();
  // Reset language
  const resetLang = (ev: React.MouseEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
    const opts = { shouldDirty: true, shouldValidate: true };
    form.setValue('langCode', undefined, opts);
    form.setValue('langName', undefined, opts);
    form.setValue('langCustom', undefined, opts);
  };
  return (
    <div className={cn('flex w-full flex-col gap-6 px-6 py-2 md:flex-row', className)}>
      <FormSection>
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-4">
              <Label htmlFor={nameKey}>Topic Name</Label>
              <FormControl>
                <Input id={nameKey} type="text" className="flex-1" placeholder="Name" {...field} />
              </FormControl>
              <FormHint>A topic name. It's good if it's a unique value.</FormHint>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* description */}
        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-4">
              <Label htmlFor={descriptionKey}>Question Description</Label>
              <FormControl>
                <Textarea
                  id={descriptionKey}
                  className="flex-1"
                  placeholder="Topic Description"
                  rows={5}
                  {...field}
                />
              </FormControl>
              <FormHint>
                A topic description. Could be used in questions and answers generation.{' '}
                <MarkdownHint />
              </FormHint>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="isPublic"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-4">
              <Label htmlFor={isPublicKey}>Is the topic public?</Label>
              <FormControl>
                <Switch id={isPublicKey} checked={!!field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormHint>
                If the topic is public it's available for all the users, not only for you.
              </FormHint>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="keywords"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-4">
              <Label htmlFor={keywordsKey}>Keywords</Label>
              <FormControl>
                <Input id={keywordsKey} type="text" placeholder="Keywords" {...field} />
              </FormControl>
              <FormHint>
                An optional list of keywords separated by commas. Could be used in questions and
                answers generation.
              </FormHint>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="langCode"
          control={form.control}
          render={() => {
            const [langCode, langName, langCustom] = form.watch([
              'langCode',
              'langName',
              'langCustom',
            ]);
            return (
              <FormItem className="flex w-full flex-col gap-4">
                <Label htmlFor={langCodeKey}>Topic Language</Label>
                <Button
                  id={langCodeKey}
                  variant="outline"
                  onClick={selectLanguage}
                  className="flex w-full justify-stretch gap-4 text-left"
                >
                  <span className="flex-1 truncate">
                    {langName ? (
                      <strong className="truncate">{langName}</strong>
                    ) : (
                      <>Select language</>
                    )}
                  </span>
                  {langCode && <span className="opacity-50">{langCode}</span>}
                  {langCustom && (
                    <span className="opacity-50">
                      <Icons.Edit className="size-3" />
                    </span>
                  )}
                  {langCode && <Icons.Close onClick={resetLang} className="size-4" />}
                </Button>
                <FormHint>An optional predefined or custom language for the topic.</FormHint>
                <FormMessage />
              </FormItem>
            );
          }}
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
                  onCheckedChange={(value) => {
                    field.onChange(value);
                    // Trigger validation for min/max fields when random is toggled
                    if (value) {
                      form.trigger(['answersCountMin', 'answersCountMax']);
                    }
                  }}
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
