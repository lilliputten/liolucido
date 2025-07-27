'use client';

import React from 'react';
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
import { useQuestionsContext } from '@/contexts/QuestionsContext';
import { updateQuestion } from '@/features/questions/actions';
import { TQuestion } from '@/features/questions/types';

import { maxNameLength, minNameLength } from '../constants';
import { EditQuestionFormActions } from './EditQuestionFormActions';
import { EditQuestionFormFields } from './EditQuestionFormFields';
import { TFormData } from './types';

const __debugShowData = false;

interface TEditQuestionFormProps {
  question: TQuestion;
  className?: string;
  onCancel?: () => void;
  toolbarPortalRef: React.RefObject<HTMLDivElement>;
  handleDeleteQuestion: () => void;
}

export function EditQuestionForm(props: TEditQuestionFormProps) {
  const { question, className, onCancel, handleDeleteQuestion, toolbarPortalRef } = props;
  const { setQuestions } = useQuestionsContext();
  const [isPending, startTransition] = React.useTransition();

  const formSchema = React.useMemo(
    () =>
      z
        .object({
          text: z.string().min(minNameLength).max(maxNameLength),
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
      const editedQuestion: TQuestion = {
        ...question,
        text: formData.text,
        answersCountRandom: formData.answersCountRandom,
        answersCountMin: formData.answersCountMin,
        answersCountMax: formData.answersCountMax,
      };
      startTransition(() => {
        const savePromise = updateQuestion(editedQuestion);
        toast.promise<unknown>(savePromise, {
          loading: 'Saving the question data...',
          success: 'Successfully saved the question',
          error: 'Can not save the question data.',
        });
        return savePromise
          .then((updatedQuestion) => {
            setQuestions((questions) => {
              return questions.map((question) =>
                question.id === updatedQuestion.id ? updatedQuestion : question,
              );
            });
            form.reset(form.getValues());
          })
          .catch((error) => {
            const message = getErrorText(error);
            // eslint-disable-next-line no-console
            console.error('[EditQuestionForm:handleFormSubmit]', message, {
              error,
            });
          });
      });
    },
    [form, setQuestions, question],
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
          />,
          toolbarPortalRoot,
        )}
    </>
  );
}
