'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { UseFormReturn } from 'react-hook-form';

import { TPropsWithChildren } from '@/shared/types/generic';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Icons } from '@/components/shared/icons';
import { isDev } from '@/constants';
import { useTopicsContext } from '@/contexts/TopicsContext/TopicsContext';
import { TTopic } from '@/features/topics/types';

import { TFormData } from './types';

interface TEditTopicFormFieldsProps {
  topic: TTopic;
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
        isDev && '__EditTopicFormFields_FormSection', // DEBUG
        'flex w-full flex-1 flex-col gap-6 py-2 md:w-[45%]',
      )}
    >
      {children}
    </div>
  );
}

export function EditTopicFormFields(props: TEditTopicFormFieldsProps) {
  const router = useRouter();
  const { className, topic, form } = props;
  const topicsContext = useTopicsContext();
  // Select language
  const selectLanguage = React.useCallback(
    (ev: React.MouseEvent) => {
      ev.preventDefault();
      const [langCode, langName, langCustom] = form.watch(['langCode', 'langName', 'langCustom']);
      const params = new URLSearchParams();
      if (langCode) params.append('langCode', langCode);
      if (langName) params.append('langName', langName);
      if (langCustom) params.append('langCustom', String(langCustom));
      router.push(
        `${topicsContext.routePath}/${topic.id}/edit/select-language?${params.toString()}`,
      );
    },
    [form, router, topic, topicsContext],
  );
  // Create unique keys for labels
  const nameKey = React.useId();
  const isPublicKey = React.useId();
  const keywordsKey = React.useId();
  const langCodeKey = React.useId();
  const answersCountRandomKey = React.useId();
  const answersCountMinKey = React.useId();
  const answersCountMaxKey = React.useId();
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
              <FormHint>An optional list of keywords separated by commas.</FormHint>
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
                <Label htmlFor={langCodeKey}>Language</Label>
                <div
                  className={cn(
                    isDev && '__EditTopicForm_SelectLanguage', // DEBUG
                    'flex items-center',
                  )}
                >
                  <Button
                    id={langCodeKey}
                    variant="outline"
                    onClick={selectLanguage}
                    className="flex w-full justify-stretch gap-4 text-left"
                  >
                    <span className="flex-1 truncate">
                      {langName ? <strong className="truncate">{langName}</strong> : <>Select</>}
                    </span>
                    {langCode && <span className="opacity-50">{langCode}</span>}
                    {langCustom && (
                      <span className="opacity-50">
                        <Icons.edit className="size-3" />
                      </span>
                    )}
                    <Icons.languages className="size-4" />
                  </Button>
                </div>
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
