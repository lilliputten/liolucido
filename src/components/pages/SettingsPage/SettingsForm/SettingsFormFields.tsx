'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';

import { TPropsWithChildren } from '@/shared/types/generic';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Icons } from '@/components/shared/icons';
import { isDev } from '@/constants';
import { TSettings } from '@/features/settings/types';

import { TFormData } from './types';

interface TSettingsFormFieldsProps {
  settings: TSettings;
  isSubmitEnabled?: boolean;
  isPending?: boolean;
  onCancel?: (ev: React.MouseEvent) => void;
  form: UseFormReturn<TFormData>;
  className?: string;
  selectLanguage: (ev: React.MouseEvent) => void;
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
        isDev && '__SettingsFormFields_FormSection', // DEBUG
        'flex w-full flex-1 flex-col gap-6 py-2 md:w-[45%]',
      )}
    >
      {children}
    </div>
  );
}

export function SettingsFormFields(props: TSettingsFormFieldsProps) {
  const { className, form, selectLanguage } = props;
  // Create unique keys for labels
  const showOthersTopicsKey = React.useId();
  const langCodeKey = React.useId();
  return (
    <div className={cn('flex w-full flex-col gap-6 px-6 py-2 md:flex-row', className)}>
      <FormSection>
        {/* showOthersTopics */}
        <FormField
          name="showOthersTopics"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-4">
              <Label htmlFor={showOthersTopicsKey}>Show all available topics?</Label>
              <FormControl>
                <Switch
                  id={showOthersTopicsKey}
                  checked={!!field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormHint>Allow show all public topics, not only my own ones.</FormHint>
              <FormMessage />
            </FormItem>
          )}
        />
      </FormSection>
      {/* langCode */}
      <FormSection>
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
                <Label htmlFor={langCodeKey}>Topics language</Label>
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
                <FormHint>
                  Specify a language if you want to see the topics only for this specific language.
                </FormHint>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </FormSection>
    </div>
  );
}
