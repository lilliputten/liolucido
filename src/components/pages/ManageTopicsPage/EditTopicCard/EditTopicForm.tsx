'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { getErrorText } from '@/lib/helpers/strings';
import { cn } from '@/lib/utils';
import { Form } from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { isDev } from '@/constants';
import { useTopicsContext } from '@/contexts/TopicsContext/TopicsContext';
import { updateTopic } from '@/features/topics/actions';
import { TTopic } from '@/features/topics/types';
import {
  selectTopicEventName,
  TSelectTopicLanguageData,
} from '@/features/topics/types/TSelectTopicLanguageData';

import { maxNameLength, minNameLength } from '../constants';
import { EditTopicFormActions } from './EditTopicFormActions';
import { EditTopicFormFields } from './EditTopicFormFields';
import { TFormData } from './types';

const __debugShowData = false;

interface TEditTopicFormProps {
  topic: TTopic;
  className?: string;
  onCancel?: () => void;
  toolbarPortalRef: React.RefObject<HTMLDivElement>;
}

export function EditTopicForm(props: TEditTopicFormProps) {
  const { topic, className, onCancel, toolbarPortalRef } = props;
  const router = useRouter();
  const topicsContext = useTopicsContext();
  const [isPending, startTransition] = React.useTransition();

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
          answersCountMax: z.union([z.string().optional(), z.number()]),
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
  // @see https://react-hook-form.com/docs/useform/formstate
  const { isDirty, isValid } = form.formState;

  // Listen for the select language modal custom event
  React.useEffect(() => {
    const handleLanguageSelected = (event: CustomEvent<TSelectTopicLanguageData>) => {
      const { langCode, langName, langCustom, topicId } = event.detail;
      // Make sure the event is for this topic
      if (topicId === topic.id) {
        // Update the form fields
        const opts = { shouldDirty: true, shouldValidate: true };
        form.setValue('langCode', langCode, opts);
        form.setValue('langName', langName, opts);
        form.setValue('langCustom', langCustom, opts);
      }
    };
    window.addEventListener(selectTopicEventName, handleLanguageSelected as EventListener);
    return () => {
      window.removeEventListener(selectTopicEventName, handleLanguageSelected as EventListener);
    };
  }, [topic, form]);

  // Select language modal trigger
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

  const isSubmitEnabled = !isPending && isDirty && isValid;

  const handleFormSubmit = React.useCallback(
    (formData: TFormData) => {
      const editedTopic: TTopic = {
        ...topic,
        name: formData.name,
        isPublic: formData.isPublic,
        keywords: formData.keywords,
        langCode: formData.langCode,
        langName: formData.langName,
        langCustom: formData.langCustom,
        answersCountRandom: formData.answersCountRandom,
        answersCountMin: formData.answersCountMin,
        answersCountMax: formData.answersCountMax,
      };
      startTransition(() => {
        const savePromise = updateTopic(editedTopic);
        toast.promise<unknown>(savePromise, {
          loading: 'Saving the topic data...',
          success: 'Successfully saved the topic',
          error: 'Can not save the topic data.',
        });
        return savePromise
          .then((updatedTopic) => {
            topicsContext.setTopics((topics) => {
              return topics.map((topic) => (topic.id === updatedTopic.id ? updatedTopic : topic));
            });
            form.reset(form.getValues());
          })
          .catch((error) => {
            const message = getErrorText(error);
            // eslint-disable-next-line no-console
            console.error('[EditTopicForm:handleFormSubmit]', message, {
              error,
            });
          });
      });
    },
    [form, topicsContext, topic],
  );

  const handleCancel = React.useCallback(
    (ev: React.MouseEvent) => {
      ev.preventDefault();
      if (onCancel) {
        onCancel();
      }
    },
    [onCancel],
  );

  const toolbarPortalRoot = toolbarPortalRef.current;

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className={cn(
            isDev && '__EditTopicForm', // DEBUG
            'flex w-full flex-col gap-4 overflow-hidden',
            isPending && 'pointer-events-none opacity-50',
            className,
          )}
        >
          {__debugShowData && isDev && (
            <pre className="opacity-50">{JSON.stringify(defaultValues, null, 2)}</pre>
          )}
          <ScrollArea>
            <EditTopicFormFields
              topic={topic}
              form={form}
              isSubmitEnabled={isSubmitEnabled}
              isPending={isPending}
              onCancel={handleCancel}
              selectLanguage={selectLanguage}
            />
          </ScrollArea>
        </form>
      </Form>
      {toolbarPortalRoot &&
        createPortal(
          <EditTopicFormActions
            topic={topic}
            form={form}
            isSubmitEnabled={isSubmitEnabled}
            isPending={isPending}
            onCancel={handleCancel}
            onSubmit={handleFormSubmit}
          />,
          toolbarPortalRoot,
        )}
    </>
  );
}
