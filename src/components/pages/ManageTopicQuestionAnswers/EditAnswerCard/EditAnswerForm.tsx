'use client';

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { APIError } from '@/shared/types/api';
import { handleServerAction } from '@/lib/api';
import { invalidateReactQueryKeys } from '@/lib/data';
import { getErrorText } from '@/lib/helpers/strings';
import { cn } from '@/lib/utils';
import { Form } from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { isDev } from '@/constants';
import { useAnswersContext } from '@/contexts/AnswersContext';
import { updateAnswer } from '@/features/answers/actions';
import { TAnswer } from '@/features/answers/types';

import { maxTextLength, minTextLength } from '../constants';
import { EditAnswerFormActions } from './EditAnswerFormActions';
import { EditAnswerFormFields } from './EditAnswerFormFields';
import { TFormData } from './types';

const __debugShowData = false;

interface TEditAnswerFormProps {
  answer: TAnswer;
  className?: string;
  onCancel?: () => void;
  toolbarPortalRoot: HTMLDivElement | null;
  handleDeleteAnswer: () => void;
  handleAddAnswer: () => void;
}

export function EditAnswerForm(props: TEditAnswerFormProps) {
  const { answer, className, onCancel, handleDeleteAnswer, handleAddAnswer, toolbarPortalRoot } =
    props;
  const { setAnswers } = useAnswersContext();
  const [isPending, startTransition] = React.useTransition();

  const formSchema = React.useMemo(
    () =>
      z.object({
        text: z.string().min(minTextLength).max(maxTextLength),
        isCorrect: z.boolean().optional(),
        isGenerated: z.boolean().optional(),
      }),
    [],
  );

  const defaultValues: TFormData = React.useMemo(
    () => ({
      text: answer.text || '',
      isCorrect: answer.isCorrect || false,
      isGenerated: answer.isGenerated || false,
    }),
    [answer],
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
      const editedAnswer: TAnswer = {
        ...answer,
        text: formData.text,
        isCorrect: formData.isCorrect,
        isGenerated: formData.isGenerated,
      };
      startTransition(() => {
        const savePromise = handleServerAction(updateAnswer(editedAnswer), {
          onInvalidateKeys: invalidateReactQueryKeys,
          debugDetails: {
            initiator: 'EditAnswerForm',
            action: 'updateAnswer',
            answerId: editedAnswer.id,
          },
        });
        toast.promise(savePromise, {
          loading: 'Saving the answer data...',
          success: 'Successfully saved the answer',
          error: 'Can not save the answer data.',
        });
        return savePromise
          .then((result) => {
            if (result.ok && result.data) {
              const updatedAnswer = result.data;
              setAnswers((answers) => {
                return answers.map((answer) =>
                  answer.id === updatedAnswer.id ? updatedAnswer : answer,
                );
              });
              form.reset(form.getValues());
            }
          })
          .catch((error) => {
            const details = error instanceof APIError ? error.details : null;
            const message = 'Cannot save answer data';
            // eslint-disable-next-line no-console
            console.error('[EditAnswerForm]', message, {
              details,
              error,
              answerId: editedAnswer.id,
            });
            debugger; // eslint-disable-line no-debugger
          });
      });
    },
    [form, setAnswers, answer],
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
            isDev && '__EditAnswerForm', // DEBUG
            'flex w-full flex-col gap-4 overflow-hidden',
            isPending && 'pointer-events-none opacity-50',
            className,
          )}
        >
          {__debugShowData && isDev && (
            <pre className="opacity-50">{JSON.stringify(defaultValues, null, 2)}</pre>
          )}
          <ScrollArea>
            <EditAnswerFormFields
              answer={answer}
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
          <EditAnswerFormActions
            answer={answer}
            form={form}
            isSubmitEnabled={isSubmitEnabled}
            isPending={isPending}
            onCancel={handleCancel}
            onSubmit={handleFormSubmit}
            handleDeleteAnswer={handleDeleteAnswer}
            handleAddAnswer={handleAddAnswer}
          />,
          toolbarPortalRoot,
        )}
    </>
  );
}
