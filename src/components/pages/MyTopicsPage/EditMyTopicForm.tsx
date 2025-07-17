'use client';

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { getErrorText } from '@/lib/helpers/strings';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/shared/icons';
import { isDev } from '@/constants';
import { useTopicsContext } from '@/contexts/TopicsContext';
import { updateTopic } from '@/features/topics/actions';
import { TTopic } from '@/features/topics/types';

import { maxNameLength, minNameLength } from './constants/inputFields';

interface TEditMyTopicFormProps {
  topic: TTopic;
  // isPending?: boolean;
  className?: string;
  onCancel?: () => void;
  // onSave: (editedTopic: TTopic) => Promise<unknown>;
}

type TFormData = Pick<TTopic, 'name'>;

interface TChildProps /* extends Omit<TEditMyTopicFormProps, 'className' | 'topic'> */ {
  isSubmitEnabled?: boolean;
  isPending?: boolean;
  onCancel?: (ev: React.MouseEvent) => void;
  form: UseFormReturn<TFormData>;
}

function FormActions(props: TChildProps) {
  const {
    ///
    isSubmitEnabled,
    isPending,
    onCancel,
    form,
  } = props;
  const {
    // @see https://react-hook-form.com/docs/useform
    formState, // FormState<TFieldValues>;
    // handleSubmit, // UseFormHandleSubmit<TFieldValues, TTransformedValues>;
    // register, // UseFormRegister<TFieldValues>;
    reset, // UseFormReset<TFieldValues>;
    // setFocus,
    // getValues,
  } = form;
  const {
    // @see https://react-hook-form.com/docs/useform/formstate
    isDirty, // boolean;
    // errors, // FieldErrors<TFieldValues>;
    // isValid, // boolean;
  } = formState;
  const Icon = isPending ? Icons.spinner : Icons.check;
  const buttonText = isPending ? 'Saving' : 'Save';
  return (
    <div className="flex w-full gap-4">
      {!isDirty && (
        <Button variant="ghost" onClick={onCancel} className="gap-2" disabled={isDirty}>
          <Icons.arrowLeft className="size-4" />
          <span>Back to the list</span>
        </Button>
      )}
      <Button
        type="submit"
        variant={isSubmitEnabled ? 'success' : 'disable'}
        disabled={!isSubmitEnabled}
        className="gap-2"
      >
        <Icon className={cn('size-4', isPending && 'animate-spin')} /> <span>{buttonText}</span>
      </Button>
      {isDirty && (
        <Button variant="ghost" onClick={() => reset()} className="gap-2" disabled={!isDirty}>
          <Icons.close className="size-4" />
          <span>Reset changes</span>
        </Button>
      )}
    </div>
  );
}

function FormFields(props: TChildProps) {
  const { form } = props;
  const {
    // @see https://react-hook-form.com/docs/useform
    // formState, // FormState<TFieldValues>;
    // handleSubmit, // UseFormHandleSubmit<TFieldValues, TTransformedValues>;
    // register, // UseFormRegister<TFieldValues>;
    // reset, // UseFormReset<TFieldValues>;
    setFocus,
    // getValues,
  } = form;
  // Focus the first field (should it be used with a languages list?)
  React.useEffect(() => setFocus('name'), [setFocus]);
  // const {
  //   // @see https://react-hook-form.com/docs/useform/formstate
  //   isDirty, // boolean;
  //   // errors, // FieldErrors<TFieldValues>;
  //   isValid, // boolean;
  // } = formState;
  const nameKey = React.useId();
  return (
    <>
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
    </>
  );
}

export function EditMyTopicForm(props: TEditMyTopicFormProps) {
  const { topic, className, onCancel } = props;
  const { setTopics } = useTopicsContext();
  const [isPending, startTransition] = React.useTransition();

  const formSchema = React.useMemo(
    () =>
      z.object({
        name: z.string().min(minNameLength).max(maxNameLength),
      }),
    [],
  );

  const defaultValues: TFormData = React.useMemo(() => {
    return {
      name: topic.name,
    };
  }, [topic]);

  // @see https://react-hook-form.com/docs/useform
  const form = useForm<TFormData>({
    // @see https://react-hook-form.com/docs/useform
    mode: 'onChange', // 'all', // Validation strategy before submitting behaviour.
    // mode: 'all', // Validation strategy before submitting behaviour.
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
    // setFocus,
    getValues,
  } = form;
  const {
    // @see https://react-hook-form.com/docs/useform/formstate
    isDirty, // boolean;
    // errors, // FieldErrors<TFieldValues>;
    isValid, // boolean;
  } = formState;

  const isSubmitEnabled = !isPending && isDirty && isValid;

  const onSubmit = handleSubmit((formData) => {
    startTransition(() => {
      const { name } = formData;
      const editedTopic: TTopic = { ...topic, name };
      console.log('[EditMyTopicForm:onSubmit] start', {
        formData,
        editedTopic,
      });
      const savePromise = updateTopic(editedTopic); // new Promise((resolve, reject) => setTimeout(resolve, 1000));
      toast.promise<unknown>(savePromise, {
        loading: 'Saving the topic data...',
        success: 'Successfully saved the topic',
        error: 'Can not save the topic data.',
      });
      return savePromise
        .then((updatedTopic) => {
          console.log('[EditMyTopicForm:onSubmit] done', {
            updatedTopic,
            formData,
            editedTopic,
          });
          setTopics((topics) =>
            topics.map((topic) => (topic.id === updatedTopic.id ? updatedTopic : topic)),
          );
          reset(getValues());
        })
        .catch((error) => {
          const message = getErrorText(error);
          // eslint-disable-next-line no-console
          console.error('[EditMyTopicForm:onSubmit]', message, {
            error,
          });
          debugger; // eslint-disable-line no-debugger
        });
    });
  });

  const handleCancel = React.useCallback(
    (ev: React.MouseEvent) => {
      ev.preventDefault();
      if (onCancel) {
        onCancel();
      }
    },
    [onCancel],
  );

  const __debugShowData = true;

  return (
    <Form {...form}>
      <form
        onSubmit={onSubmit}
        className={cn(
          isDev && '__EditMyTopicForm', // DEBUG
          'flex w-full flex-col gap-4',
          isPending && 'pointer-events-none opacity-50',
          className,
        )}
      >
        {__debugShowData && isDev && (
          <pre className="opacity-50">{JSON.stringify(topic, null, 2)}</pre>
        )}
        <FormFields
          form={form}
          isSubmitEnabled={isSubmitEnabled}
          isPending={isPending}
          onCancel={handleCancel}
        />
        <div className="flex flex-col justify-between"></div>
        <FormActions
          form={form}
          isSubmitEnabled={isSubmitEnabled}
          isPending={isPending}
          onCancel={handleCancel}
        />
      </form>
    </Form>
  );
}
