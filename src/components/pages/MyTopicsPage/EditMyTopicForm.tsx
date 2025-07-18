'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { myTopicsRoute } from '@/config/routesConfig';
import { getErrorText } from '@/lib/helpers/strings';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { Switch } from '@/components/ui/switch';
import { Icons } from '@/components/shared/icons';
import { isDev } from '@/constants';
import { useTopicsContext } from '@/contexts/TopicsContext';
import { updateTopic } from '@/features/topics/actions';
import { TTopic, TTopicNoNulls } from '@/features/topics/types';

import { maxNameLength, minNameLength } from './constants/inputFields';

const __debugShowData = false;

interface TEditMyTopicFormProps {
  topic: TTopic;
  className?: string;
  onCancel?: () => void;
}

type TFormData = Pick<
  TTopicNoNulls,
  | 'name' // string
  | 'isPublic' // boolean
  | 'keywords' // string
  | 'langCode' // string (TLanguageId)
  | 'langName' // string
  | 'langCustom' // boolean
  | 'answersCountRandom' // boolean
  | 'answersCountMin' // number
  | 'answersCountMax' // number
>;

interface TChildProps {
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

function FormActions(props: TChildProps) {
  const { className, isSubmitEnabled, isPending, onCancel, form } = props;
  const {
    // @see https://react-hook-form.com/docs/useform
    formState, // FormState<TFieldValues>;
    reset, // UseFormReset<TFieldValues>;
  } = form;
  const { isDirty } = formState;
  const Icon = isPending ? Icons.spinner : Icons.check;
  const buttonText = isPending ? 'Saving' : 'Save';
  return (
    <div className={cn('flex w-full flex-wrap gap-4 px-6 py-2', className)}>
      <Button
        type="submit"
        variant={isSubmitEnabled ? 'success' : 'disable'}
        disabled={!isSubmitEnabled}
        className="gap-2"
      >
        <Icon className={cn('size-4', isPending && 'animate-spin')} /> <span>{buttonText}</span>
      </Button>
      {!isDirty && (
        <Button variant="ghost" onClick={onCancel} className="gap-2" disabled={isDirty}>
          <Icons.arrowLeft className="size-4" />
          <span>Back to the list</span>
        </Button>
      )}
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
  const router = useRouter();
  const { className, topic, form } = props;
  const {
    // @see https://react-hook-form.com/docs/useform
    setFocus,
    watch,
  } = form;
  // Focus the first field (should it be used with a languages list?)
  React.useEffect(() => setFocus('name'), [setFocus]);
  // Select language
  const selectLanguage = (ev: React.MouseEvent) => {
    ev.preventDefault();
    const [langCode, langName, langCustom] = watch(['langCode', 'langName', 'langCustom']);
    const params = new URLSearchParams();
    if (langCode) params.append('langCode', langCode);
    if (langName) params.append('langName', langName);
    if (langCustom) params.append('langCustom', String(langCustom));
    router.push(`${myTopicsRoute}/edit/${topic.id}/select-language?${params.toString()}`);
  };
  // Create unique keys for labels
  const nameKey = React.useId();
  const isPublicKey = React.useId();
  const keywordsKey = React.useId();
  const langCodeKey = React.useId();
  const answersCountRandomKey = React.useId();
  const answersCountMinKey = React.useId();
  const answersCountMaxKey = React.useId();
  const __debugValues = watch([
    'name',
    'isPublic',
    'keywords',
    'langCode',
    'langName',
    'langCustom',
    'answersCountRandom',
    'answersCountMin',
    'answersCountMax',
  ]);
  return (
    <div className={cn('flex w-full flex-col gap-6 px-6 py-2 md:flex-row', className)}>
      {__debugShowData && isDev && (
        <pre className="py-6 opacity-50">{JSON.stringify(__debugValues, null, 2)}</pre>
      )}
      <div className="flex w-full flex-col gap-6 py-2">
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
        <div
          className={cn(
            isDev && '__EditMyTopicForm_SelectLanguage', // DEBUG
            'flex items-center',
          )}
        >
          <span className="flex-1">Language: {watch('langCode') || '(none)'}</span>
          <Button onClick={selectLanguage} className="gap-2">
            <Icons.languages className="size-4" />
            <span>Select</span>
          </Button>
        </div>
        <FormField
          name="langCode"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-4">
              <Label htmlFor={langCodeKey}>Language code</Label>
              <FormControl>
                <Input id={langCodeKey} type="text" placeholder="Language code" {...field} />
              </FormControl>
              <FormHint>An optional language code (eg, "en", "ru", etc) for the topic.</FormHint>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex w-full flex-col gap-6 py-2">
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
        {!!watch('answersCountRandom') && (
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
      </div>
    </div>
  );
}

export function EditMyTopicForm(props: TEditMyTopicFormProps) {
  const { topic, className, onCancel } = props;
  const { setTopics } = useTopicsContext();
  const [isPending, startTransition] = React.useTransition();
  const formRef = React.useRef<UseFormReturn<TFormData>>();

  // Listen for the language-selected custom event
  React.useEffect(() => {
    const handleLanguageSelected = (event: CustomEvent) => {
      const { langCode, topicId } = event.detail;
      // TODO: Add and pass all other lang* params
      console.log('[EditMyTopicForm:handleLanguageSelected]', {
        langCode,
        topicId,
      });
      debugger;

      // Make sure the event is for this topic
      if (topicId === topic.id && formRef.current) {
        // Update the form field
        formRef.current.setValue('langCode', langCode, {
          shouldDirty: true,
          shouldValidate: true,
        });
      }
    };

    // Add event listener
    window.addEventListener('language-selected', handleLanguageSelected as EventListener);

    // Clean up
    return () => {
      window.removeEventListener('language-selected', handleLanguageSelected as EventListener);
    };
  }, [topic.id]);

  const formSchema = React.useMemo(
    () =>
      z
        .object({
          name: z.string().min(minNameLength).max(maxNameLength),
          isPublic: z.boolean(),
          keywords: z.string().optional(),
          langCode: z.string().optional(),
          langName: z.string().optional(),
          langCustom: z.boolean().optional(),
          answersCountRandom: z.boolean().optional(),
          answersCountMin: z.union([z.string().optional(), z.number()]),
          answersCountMax: z.union([z.string().optional(), z.number()]), // z.union([z.string().optional(), z.number()]),
        })
        .superRefine((data, ctx) => {
          const { answersCountRandom } = data;
          if (answersCountRandom) {
            const answersCountMin = Number(data.answersCountMin);
            const answersCountMax = Number(data.answersCountMax);
            if (!answersCountMin || answersCountMin < 1) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'It should be a positive number.',
                path: ['answersCountMin'],
              });
            }
            if (!answersCountMax || answersCountMax < 1) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'It should be a positive number.',
                path: ['answersCountMax'],
              });
            }
            if (answersCountMin > answersCountMax) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'A minimal value should be less than maximal.',
                path: ['answersCountMin'],
              });
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'A minimal value should be less than maximal.',
                path: ['answersCountMax'],
              });
            }
          }
        }),
    [],
  );

  const defaultValues: TFormData = React.useMemo(
    () => ({
      name: topic.name || '',
      isPublic: topic.isPublic || false,
      keywords: topic.keywords || '',
      langCode: topic.langCode || '',
      langName: topic.langName || '',
      langCustom: topic.langCustom || false,
      answersCountRandom: topic.answersCountRandom || false,
      answersCountMin: topic.answersCountMin || undefined,
      answersCountMax: topic.answersCountMax || undefined,
    }),
    [topic],
  );

  // @see https://react-hook-form.com/docs/useform
  const form = useForm<TFormData>({
    // @see https://react-hook-form.com/docs/useform
    mode: 'onChange', // 'all', // Validation strategy before submitting behaviour.
    criteriaMode: 'all', // Display all validation errors or one at a time.
    resolver: zodResolver(formSchema),
    defaultValues, // Default values for the form.
  });

  // Store form reference for the event listener
  formRef.current = form;

  const {
    // @see https://react-hook-form.com/docs/useform
    formState, // FormState<TFieldValues>;
    handleSubmit, // UseFormHandleSubmit<TFieldValues, TTransformedValues>;
    reset, // UseFormReset<TFieldValues>;
    getValues,
  } = form;
  const {
    // @see https://react-hook-form.com/docs/useform/formstate
    isDirty,
    isValid,
  } = formState;

  const isSubmitEnabled = !isPending && isDirty && isValid;

  const onSubmit = handleSubmit((formData) => {
    const {
      name,
      isPublic,
      keywords,
      langCode,
      langName,
      langCustom,
      answersCountRandom,
      answersCountMin,
      answersCountMax,
    } = formData;
    const editedTopic: TTopic = {
      ...topic,
      name,
      isPublic,
      keywords,
      langCode,
      langName,
      langCustom,
      answersCountRandom,
      answersCountMin,
      answersCountMax,
    };
    if (
      answersCountRandom &&
      (!answersCountMin ||
        !answersCountMax ||
        answersCountMin <= 1 ||
        answersCountMin > answersCountMax)
    ) {
      toast.error('Enter correct values for minimal and maximal answer counts.');
      return;
    }
    // TODO: Check all the values?
    console.log('[EditMyTopicForm:onSubmit] Saving started', {
      formData,
      editedTopic,
    });
    startTransition(() => {
      const savePromise = updateTopic(editedTopic);
      toast.promise<unknown>(savePromise, {
        loading: 'Saving the topic data...',
        success: 'Successfully saved the topic',
        error: 'Can not save the topic data.',
      });
      return savePromise
        .then((updatedTopic) => {
          /* console.log('[EditMyTopicForm:onSubmit] Saving finished', {
           *   updatedTopic,
           *   formData,
           *   editedTopic,
           * });
           */
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

  return (
    <Form {...form}>
      <form
        onSubmit={onSubmit}
        className={cn(
          isDev && '__EditMyTopicForm', // DEBUG
          'flex w-full flex-col gap-4 overflow-hidden',
          isPending && 'pointer-events-none opacity-50',
          className,
        )}
      >
        {__debugShowData && isDev && (
          <pre className="opacity-50">{JSON.stringify(defaultValues, null, 2)}</pre>
        )}
        <ScrollArea>
          <FormFields
            topic={topic}
            form={form}
            isSubmitEnabled={isSubmitEnabled}
            isPending={isPending}
            onCancel={handleCancel}
          />
        </ScrollArea>
        <FormActions
          topic={topic}
          form={form}
          isSubmitEnabled={isSubmitEnabled}
          isPending={isPending}
          onCancel={handleCancel}
        />
      </form>
    </Form>
  );
}
