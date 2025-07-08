'use client';

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { getErrorText } from '@/lib/helpers/strings';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/shared/icons';
import { TNewTopic, TTopic } from '@/features/topics/types';

import { maxNameLength, minNameLength } from './constants/inputFields';

export type TAddTopicParams = TNewTopic;

export interface TAddTopicFormProps {
  handleAddTopic: (p: TAddTopicParams) => Promise<unknown>;
  handleClose?: () => void;
  className?: string;
  forwardPending?: (isPending: boolean) => void;
}

export interface TFormData {
  name: TTopic['name'];
}

export function AddTopicForm(props: TAddTopicFormProps) {
  const {
    // prettier-ignore
    className,
    handleAddTopic,
    handleClose,
    forwardPending,
  } = props;

  const [isPending, startTransition] = React.useTransition();

  React.useEffect(() => forwardPending?.(isPending), [forwardPending, isPending]);

  const formSchema = React.useMemo(
    () =>
      z.object({
        name: z.string().min(minNameLength).max(maxNameLength),
      }),
    [],
  );

  const defaultValues: TFormData = React.useMemo(() => {
    return {
      name: '',
    };
  }, []);

  // @see https://react-hook-form.com/docs/useform
  const form = useForm<TFormData>({
    // @see https://react-hook-form.com/docs/useform
    // mode: 'onChange', // 'all', // Validation strategy before submitting behaviour.
    mode: 'all', // Validation strategy before submitting behaviour.
    criteriaMode: 'all', // Display all validation errors or one at a time.
    resolver: zodResolver(formSchema),
    defaultValues, // Default values for the form.
  });

  const {
    // @see https://react-hook-form.com/docs/useform
    formState, // FormState<TFieldValues>;
    handleSubmit, // UseFormHandleSubmit<TFieldValues, TTransformedValues>;
    // register, // UseFormRegister<TFieldValues>;
    reset, // UseFormReset<TFieldValues>;
    setFocus,
  } = form;

  // Focus the first field (should it be used with a languages list?)
  React.useEffect(() => setFocus('name'), [setFocus]);

  const {
    // @see https://react-hook-form.com/docs/useform/formstate
    isDirty, // boolean;
    // errors, // FieldErrors<TFieldValues>;
    isValid, // boolean;
  } = formState;

  const isSubmitEnabled = !isPending && isDirty && isValid;

  const onSubmit = handleSubmit((formData) => {
    startTransition(async () => {
      const { name } = formData;
      const newTopic: TNewTopic = { name };
      return handleAddTopic(newTopic)
        .then(() => {
          reset();
          if (handleClose) {
            handleClose();
          }
        })
        .catch((error) => {
          const message = getErrorText(error) || 'An unknown error has occurred.';
          // eslint-disable-next-line no-console
          console.error('[AddTopicForm:onSubmit]', message, {
            error,
          });
          debugger; // eslint-disable-line no-debugger
        });
    });
  });

  const nameKey = React.useId();

  return (
    <Form {...form}>
      <form
        onSubmit={onSubmit}
        className={cn(
          // prettier-ignore
          className,
          '__AddTopicForm',
          'flex w-full flex-col gap-4',
        )}
      >
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-4">
              <Label className="m-0" htmlFor={nameKey}>
                Topic Name
              </Label>
              <FormControl>
                <Input
                  id={nameKey}
                  type="text"
                  className="flex-1"
                  placeholder="Name"
                  {...field}
                  onChange={(ev) => field.onChange(ev)}
                />
              </FormControl>
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
            {isPending ? (
              <>
                <Icons.spinner className="size-4 animate-spin" /> <span>Adding</span>
              </>
            ) : (
              <>
                <Icons.check className="size-4" /> <span>Add</span>
              </>
            )}
          </Button>
          <Button variant="ghost" onClick={handleClose} className="gap-2">
            <Icons.close className="size-4" />
            <span>Cancel</span>
          </Button>
        </div>
      </form>
    </Form>
  );
}
