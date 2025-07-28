'use client';

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Icons } from '@/components/shared/icons';
import { isDev } from '@/constants';
import { TAnswer, TNewAnswer } from '@/features/answers/types';
import { TQuestionId } from '@/features/questions/types';

import { maxTextLength, minTextLength } from '../constants';

export type TAddAnswerParams = TNewAnswer;

export interface TAddAnswerFormProps {
  handleAddAnswer: (p: TAddAnswerParams) => Promise<unknown>;
  handleClose?: () => void;
  className?: string;
  isPending?: boolean;
  // topicId: TTopicId;
  questionId: TQuestionId;
}

export interface TFormData {
  text: TAnswer['text'];
}

function FormHint({ children }: { children?: React.ReactNode }) {
  if (!children) {
    return null;
  }
  return <div className="relative text-sm opacity-20">{children}</div>;
}

export function AddAnswerForm(props: TAddAnswerFormProps) {
  const { className, handleAddAnswer, handleClose, isPending, questionId } = props;

  const formSchema = React.useMemo(
    () =>
      z.object({
        text: z.string().min(minTextLength).max(maxTextLength),
      }),
    [],
  );

  const defaultValues: TFormData = React.useMemo(() => {
    return {
      text: '',
    };
  }, []);

  // @see https://react-hook-form.com/docs/useform
  const form = useForm<TFormData>({
    mode: 'onChange',
    criteriaMode: 'all',
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { formState, handleSubmit, setFocus } = form;

  // Focus the first field (should it be used with a languages list?)
  React.useEffect(() => setFocus('text'), [setFocus]);

  const { isDirty, isValid } = formState;

  const isSubmitEnabled = !isPending && isDirty && isValid;

  const onSubmit = handleSubmit((formData) => {
    const { text } = formData;
    const newAnswer: TNewAnswer = { text, questionId };
    handleAddAnswer(newAnswer);
  });

  const onClose = (ev: React.MouseEvent) => {
    if (handleClose) {
      handleClose();
    }
    ev.preventDefault();
  };

  const textKey = React.useId();

  const Icon = isPending ? Icons.spinner : Icons.check;
  const buttonText = isPending ? 'Adding' : 'Add';

  return (
    <Form {...form}>
      <form
        onSubmit={onSubmit}
        className={cn(
          isDev && '__AddAnswerForm', // DEBUG
          'flex w-full flex-col gap-4',
          className,
        )}
      >
        <FormField
          name="text"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-4">
              <Label className="m-0" htmlFor={textKey}>
                Answer Text
              </Label>
              <FormControl>
                <Textarea
                  id={textKey}
                  className="flex-1"
                  placeholder="Text"
                  rows={5}
                  {...field}
                  onChange={(ev) => field.onChange(ev)}
                />
              </FormControl>
              <FormHint>
                You'll be able to edit it later, as well as other answer poroperties.
              </FormHint>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col justify-between"></div>
        {/* Actions */}
        <div className="flex w-full gap-4">
          <Button
            type="submit"
            variant={isSubmitEnabled ? 'default' : 'disable'}
            disabled={!isSubmitEnabled}
            className="gap-2"
          >
            <Icon className={cn('size-4', isPending && 'animate-spin')} /> <span>{buttonText}</span>
          </Button>
          <Button variant="ghost" onClick={onClose} className="gap-2">
            <Icons.close className="size-4" />
            <span>Cancel</span>
          </Button>
        </div>
      </form>
    </Form>
  );
}
