'use client';

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { APIError } from '@/shared/types/api';
import { handleApiResponse } from '@/lib/api';
import { useInvalidateReactQueryKeys } from '@/lib/data/invalidateReactQueryKeys';
import { cn } from '@/lib/utils';
import { useAvailableQuestions } from '@/hooks/react-query/useAvailableQuestions';
import { Form } from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { isDev } from '@/constants';
import { TQuestion, TQuestionData } from '@/features/questions/types';

import { maxTextLength, minTextLength } from '../constants';
import { EditQuestionFormActions } from './EditQuestionFormActions';
import { EditQuestionFormFields } from './EditQuestionFormFields';
import { TFormData } from './types';

const __debugShowData = false;

interface TEditQuestionFormProps {
  availableQuestionsQuery: ReturnType<typeof useAvailableQuestions>;
  question: TQuestion;
  className?: string;
  onCancel?: () => void;
  toolbarPortalRoot: HTMLDivElement | null;
  handleDeleteQuestion: () => void;
  handleAddQuestion?: () => void;
}

export function EditQuestionForm(props: TEditQuestionFormProps) {
  const {
    availableQuestionsQuery,
    question,
    className,
    onCancel,
    handleDeleteQuestion,
    handleAddQuestion,
    toolbarPortalRoot,
  } = props;
  const [isPending, startTransition] = React.useTransition();
  const invalidateKeys = useInvalidateReactQueryKeys();

  const formSchema = React.useMemo(
    () =>
      z
        .object({
          text: z.string().min(minTextLength).max(maxTextLength),
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
      text: question.text || '',
      answersCountRandom: question.answersCountRandom || false,
      answersCountMin: question.answersCountMin || undefined,
      answersCountMax: question.answersCountMax || undefined,
    }),
    [question],
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

  const isSubmitEnabled = !isPending && isDirty && isValid;

  const handleFormSubmit = React.useCallback(
    (formData: TFormData) => {
      const editedQuestion: TQuestionData = {
        id: question.id,
        topicId: question.topicId,
        text: formData.text,
        answersCountRandom: formData.answersCountRandom,
        answersCountMin: formData.answersCountMin,
        answersCountMax: formData.answersCountMax,
      };
      startTransition(() => {
        const savePromise = handleApiResponse(
          fetch(`/api/questions/${editedQuestion.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editedQuestion),
          }),
          {
            onInvalidateKeys: invalidateKeys,
            debugDetails: {
              initiator: 'EditQuestionForm',
              action: 'updateQuestion',
              questionId: editedQuestion.id,
            },
          },
        );
        toast.promise(savePromise, {
          loading: 'Saving the question data...',
          success: 'Successfully saved the question',
          error: 'Can not save the question data.',
        });
        return savePromise
          .then((result) => {
            if (result.ok && result.data) {
              const updatedQuestion = result.data as TQuestion;
              /* // UNUSED: QuestionsContext
               * setQuestions((questions) => {
               *   return questions.map((question) =>
               *     question.id === updatedQuestion.id ? updatedQuestion : question,
               *   );
               * });
               */
              // Update the item to the cached react-query data
              availableQuestionsQuery.updateQuestion(updatedQuestion);
              // TODO: Update or invalidate all other possible AvailableQuestion and AvailableQuestions cached data
              // Invalidate all other keys...
              availableQuestionsQuery.invalidateAllKeysExcept([availableQuestionsQuery.queryKey]);
              // Reset form to the current data
              form.reset(form.getValues());
              // TODO: Convert `updatedQuestion` to the form data & reset form to these values?
            }
          })
          .catch((error) => {
            const details = error instanceof APIError ? error.details : null;
            const message = 'Cannot save question data';
            // eslint-disable-next-line no-console
            console.error('[EditQuestionForm]', message, {
              details,
              error,
              questionId: editedQuestion.id,
            });
            debugger; // eslint-disable-line no-debugger
          });
      });
    },
    [availableQuestionsQuery, form, question, invalidateKeys],
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

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className={cn(
            isDev && '__EditQuestionForm', // DEBUG
            'flex w-full flex-col gap-4 overflow-hidden',
            isPending && 'pointer-events-none opacity-50',
            className,
          )}
        >
          {__debugShowData && isDev && (
            <pre className="opacity-50">{JSON.stringify(defaultValues, null, 2)}</pre>
          )}
          <ScrollArea>
            <EditQuestionFormFields
              question={question}
              form={form}
              isSubmitEnabled={isSubmitEnabled}
              isPending={isPending}
              onCancel={handleCancel}
            />
          </ScrollArea>
        </form>
      </Form>
      {toolbarPortalRoot &&
        createPortal(
          <EditQuestionFormActions
            question={question}
            form={form}
            isSubmitEnabled={isSubmitEnabled}
            isPending={isPending}
            onCancel={handleCancel}
            onSubmit={handleFormSubmit}
            handleDeleteQuestion={handleDeleteQuestion}
            handleAddQuestion={handleAddQuestion}
          />,
          toolbarPortalRoot,
        )}
    </>
  );
}
