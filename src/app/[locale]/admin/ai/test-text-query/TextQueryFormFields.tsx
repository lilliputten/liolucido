'use client';

import React from 'react';

import { aiClientTypes } from '@/lib/ai/types/TAiClientType';
import { cn } from '@/lib/utils';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/Form';
import { Label } from '@/components/ui/Label';
import { ScrollArea } from '@/components/ui/ScrollArea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { Switch } from '@/components/ui/Switch';
import { Textarea } from '@/components/ui/Textarea';
import { FormHint } from '@/components/blocks/FormHint';
import { isDev } from '@/config';

import { TFormType } from './TextQueryFormDefinitions';

interface TTextQueryFormFieldsProps {
  form: TFormType;
  className?: string;
}

export function TextQueryFormFields(props: TTextQueryFormFieldsProps) {
  const { form, className } = props;

  const modelKey = React.useId();
  const systemQueryTextKey = React.useId();
  const userQueryTextKey = React.useId();
  const showDebugDataKey = React.useId();

  return (
    <ScrollArea
      className={cn(
        isDev && '__TextQueryFormFields_Scroll', // DEBUG
        'flex flex-col',
        className,
      )}
      viewportClassName={cn(
        isDev && '__TextQueryFormFields_ScrollViewport', // DEBUG
        'px-6 [&>div]:!flex [&>div]:flex-col [&>div]:gap-4 [&>div]:flex-1',
      )}
    >
      {/* Show Debug Data */}
      <FormField
        name="showDebugData"
        control={form.control}
        render={({ field }) => (
          <FormItem className="flex w-full flex-col gap-4">
            <Label htmlFor={showDebugDataKey}>Use debug data?</Label>
            <FormControl>
              <Switch
                id={showDebugDataKey}
                checked={!!field.value}
                onCheckedChange={field.onChange}
                className="data-[state=checked]:bg-red-500 data-[state=checked]:hover:bg-red-600"
              />
            </FormControl>
            <FormHint>
              Enable to use fake local data instead of making actual API calls for testing purposes.
            </FormHint>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* AI Model */}
      <FormField
        name="model"
        control={form.control}
        render={({ field }) => (
          <FormItem className="flex w-full flex-col gap-4">
            <Label htmlFor={modelKey}>AI Model</Label>
            <FormControl>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id={modelKey} className="flex flex-1">
                  <SelectValue placeholder="Select AI model…" />
                </SelectTrigger>
                <SelectContent>
                  {aiClientTypes.map((id) => (
                    <SelectItem key={id} value={id}>
                      {id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormHint>Select the AI model to use for the query.</FormHint>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* System Query Text */}
      <FormField
        name="systemQueryText"
        control={form.control}
        render={({ field }) => (
          <FormItem className="flex w-full flex-col gap-4">
            <Label htmlFor={systemQueryTextKey}>System Query Text</Label>
            <FormControl>
              <Textarea
                id={systemQueryTextKey}
                className="h-32"
                placeholder="Provide the context, personality, and rules for the entire interaction. The system prompt is typically sent only once at the beginning."
                {...field}
              />
            </FormControl>
            <FormHint>
              Sets the context, personality, and rules for the entire interaction. Sent once at the
              beginning.
            </FormHint>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* User Query Text */}
      <FormField
        name="userQueryText"
        control={form.control}
        render={({ field }) => (
          <FormItem className="flex w-full flex-col gap-4">
            <Label htmlFor={userQueryTextKey}>User Query Text</Label>
            <FormControl>
              <Textarea
                id={userQueryTextKey}
                className="h-32"
                placeholder="User placeholder query text"
                {...field}
              />
            </FormControl>
            <FormHint>
              The user's question, command, or statement that requires a response from the AI.
            </FormHint>
            <FormMessage />
          </FormItem>
        )}
      />
    </ScrollArea>
  );
}
