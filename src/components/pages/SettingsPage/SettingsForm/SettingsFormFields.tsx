'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';

import { TPropsWithChildren } from '@/shared/types/generic';
import { cn } from '@/lib/utils';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
  const { className, form } = props;
  // Create unique keys for labels
  const showOthersTopicsKey = React.useId();
  return (
    <div className={cn('flex w-full flex-col gap-6 px-6 py-2 md:flex-row', className)}>
      <FormSection>
        <FormField
          name="showOthersTopics"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-4">
              <Label htmlFor={showOthersTopicsKey}>Use random settings count?</Label>
              <FormControl>
                <Switch
                  id={showOthersTopicsKey}
                  checked={!!field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormHint>
                Allow to generate random number of answers for settings (if it's not overidden in
                the settings settings).
              </FormHint>
              <FormMessage />
            </FormItem>
          )}
        />
      </FormSection>
    </div>
  );
}
