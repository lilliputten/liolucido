'use client';

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

import { APIError } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useAvailableQuestionById } from '@/hooks/react-query/useAvailableQuestionById';
import { useAvailableQuestions } from '@/hooks/react-query/useAvailableQuestions';
import { Card } from '@/components/ui/Card';
import { TActionMenuItem } from '@/components/dashboard/DashboardActions';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { maxTextLength, minTextLength } from '@/components/pages/ManageTopicQuestions/constants';
import * as Icons from '@/components/shared/Icons';
import { isDev } from '@/constants';
import { updateQuestion } from '@/features/questions/actions';
import { useQuestionsBreadcrumbsItems } from '@/features/questions/components/QuestionsBreadcrumbs';
import { TQuestionData, TQuestionId } from '@/features/questions/types';
import { TTopicId } from '@/features/topics/types';
import { useAvailableTopicById, useGoBack, useGoToTheRoute } from '@/hooks';
import { useManageTopicsStore } from '@/stores/ManageTopicsStoreProvider';

// import { topicQuestionDeletedEventId } from '../DeleteQuestionModal';
import { EditQuestionForm } from './EditQuestionForm';
import { TFormData } from './types';

interface TEditQuestionCardProps {
  topicId: TTopicId;
  questionId: TQuestionId;
  availableTopicQuery: ReturnType<typeof useAvailableTopicById>;
  availableQuestionsQuery: ReturnType<typeof useAvailableQuestions>;
  availableQuestionQuery: ReturnType<typeof useAvailableQuestionById>;
}

export function EditQuestionCard(props: TEditQuestionCardProps) {
  const {
    // className,
    topicId,
    questionId,
    availableTopicQuery,
    availableQuestionsQuery,
    availableQuestionQuery,
  } = props;
  const { manageScope } = useManageTopicsStore();

  const topicsListRoutePath = `/topics/${manageScope}`;
  const topicRoutePath = `${topicsListRoutePath}/${topicId}`;
  const questionsListRoutePath = `${topicRoutePath}/questions`;
  // const questionRoutePath = `${questionsListRoutePath}/${questionId}`;
  // const answersListRoutePath = `${questionRoutePath}/answers`;
  // const answerRoutePath = `${answersListRoutePath}/${answerId}`;

  const goToTheRoute = useGoToTheRoute();
  const goBack = useGoBack(questionsListRoutePath);

  // const availableTopicQuery = useAvailableTopicById({ id: topicId });
  const {
    topic,
    // isFetched: isTopicFetched,
    // isLoading: isTopicLoading,
  } = availableTopicQuery;

  // const availableQuestionsQuery = useAvailableQuestions({ topicId });
  // const {
  //   // ...
  //   queryKey: availableQuestionsQueryKey,
  //   queryProps: availableQuestionsQueryProps,
  // } = availableQuestionsQuery;

  // const availableQuestionQuery = useAvailableQuestionById({
  //   id: questionId,
  //   availableQuestionsQueryKey,
  //   includeTopic: availableQuestionsQueryProps.includeTopic,
  //   includeAnswersCount: availableQuestionsQueryProps.includeAnswersCount,
  // });
  const {
    question,
    // isFetched: isQuestionFetched,
    // isLoading: isQuestionLoading,
  } = availableQuestionQuery;

  if (!topic) {
    throw new Error('No topic found');
  }
  if (!question) {
    throw new Error('No question found');
  }

  const [isPending, startTransition] = React.useTransition();

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
      startTransition(async () => {
        try {
          const promise = updateQuestion(editedQuestion);
          toast.promise(promise, {
            loading: 'Saving the question data...',
            success: 'Successfully saved the question',
            error: 'Can not save the question data.',
          });
          const updatedQuestion = await promise;
          // Update the item to the cached react-query data
          availableQuestionsQuery.updateQuestion(updatedQuestion);
          // TODO: Update or invalidate all other possible AvailableQuestion and AvailableQuestions cached data
          // Invalidate all other keys...
          availableQuestionsQuery.invalidateAllKeysExcept([availableQuestionsQuery.queryKey]);
          // Reset form to the current data
          form.reset(form.getValues());
          // TODO: Convert `updatedQuestion` to the form data & reset form to these values?
        } catch (error) {
          const details = error instanceof APIError ? error.details : null;
          const message = 'Cannot save question data';
          // eslint-disable-next-line no-console
          console.error('[EditQuestionCard]', message, {
            details,
            error,
            questionId: editedQuestion.id,
          });
          debugger; // eslint-disable-line no-debugger
        }
      });
    },
    [availableQuestionsQuery, form, question],
  );

  const handleReload = React.useCallback(() => {
    availableQuestionQuery
      .refetch()
      .then((res) => {
        const question = res.data;
        if (question) {
          form.reset(question as TFormData);
          // Add the created item to the cached react-query data
          availableQuestionsQuery.updateQuestion(question);
          // Invalidate all other keys...
          availableQuestionsQuery.invalidateAllKeysExcept([availableQuestionsQuery.queryKey]);
        }
      })
      .catch((error) => {
        const message = 'Cannot update question data';
        // eslint-disable-next-line no-console
        console.error('[EditQuestionCard:handleReload]', message, {
          error,
        });
        debugger; // eslint-disable-line no-debugger
        toast.error(message);
      });
  }, [availableQuestionsQuery, availableQuestionQuery, form]);

  const handleSubmit = form.handleSubmit(handleFormSubmit);

  const actions: TActionMenuItem[] = React.useMemo(
    () => [
      {
        id: 'Back',
        content: 'Back',
        variant: 'ghost',
        icon: Icons.ArrowLeft,
        visibleFor: 'xs',
        onClick: goBack,
      },
      {
        id: 'Reload',
        content: 'Reload',
        title: 'Reload the data from the server',
        variant: 'ghost',
        icon: Icons.Refresh,
        visibleFor: 'lg',
        pending: availableQuestionQuery.isRefetching,
        onClick: handleReload,
      },
      {
        id: 'Reset',
        content: 'Reset changes',
        variant: 'ghost',
        icon: Icons.Close,
        visibleFor: 'lg',
        onClick: () => form.reset(),
        hidden: !isDirty,
      },
      {
        id: 'Add New Question',
        content: 'Add New Question',
        variant: 'ghost',
        icon: Icons.Add,
        // visibleFor: 'lg',
        onClick: () => goToTheRoute(`${questionsListRoutePath}/add`),
      },
      {
        id: 'Delete Question',
        content: 'Delete Question',
        variant: 'destructive',
        icon: Icons.Trash,
        // visibleFor: 'lg',
        onClick: () => goToTheRoute(`${questionsListRoutePath}/delete?questionId=${questionId}`),
      },
      {
        id: 'Save',
        content: 'Save',
        variant: 'success',
        icon: Icons.Check,
        visibleFor: 'md',
        disabled: !isSubmitEnabled,
        pending: isPending,
        onClick: handleSubmit,
      },
    ],
    [
      goBack,
      availableQuestionQuery.isRefetching,
      handleReload,
      isDirty,
      isSubmitEnabled,
      isPending,
      handleSubmit,
      form,
      goToTheRoute,
      questionsListRoutePath,
      questionId,
    ],
  );

  const breadcrumbs = useQuestionsBreadcrumbsItems({
    scope: manageScope,
    isLoading: !topic || !question,
    topic: topic,
    question: question,
  });

  return (
    <>
      <DashboardHeader
        heading="Edit Question Properties"
        className={cn(
          isDev && '__EditQuestionCard_DashboardHeader', // DEBUG
          'mx-6',
        )}
        breadcrumbs={breadcrumbs}
        actions={actions}
      />
      <Card
        className={cn(
          isDev && '__EditQuestionCard_Card', // DEBUG
          'relative mx-6 flex flex-1 flex-col overflow-hidden py-6 xl:col-span-2',
        )}
      >
        <EditQuestionForm
          className={cn(
            isDev && '__EditQuestionCard_Form', // DEBUG
          )}
          form={form}
          handleFormSubmit={handleFormSubmit}
          isPending={isPending}
        />
      </Card>
    </>
  );
}
