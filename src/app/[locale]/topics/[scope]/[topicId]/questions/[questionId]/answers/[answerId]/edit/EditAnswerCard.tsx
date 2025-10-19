'use client';

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { APIError } from '@/lib/types/api';
import { invalidateKeysByPrefixes, makeQueryKeyPrefix } from '@/lib/helpers/react-query';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { TActionMenuItem } from '@/components/dashboard/DashboardActions';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import {
  maxTextLength,
  minTextLength,
} from '@/components/pages/ManageTopicQuestionAnswers/constants';
import { topicAnswerDeletedEventId } from '@/components/pages/ManageTopicQuestionAnswers/DeleteAnswerModal';
import * as Icons from '@/components/shared/Icons';
import { isDev } from '@/constants';
import { updateAnswer } from '@/features/answers/actions';
import { useAnswersBreadcrumbsItems } from '@/features/answers/components/AnswersBreadcrumbs';
import { TAnswer } from '@/features/answers/types';
import {
  useAvailableAnswerById,
  useAvailableAnswers,
  useAvailableQuestionById,
  useAvailableTopicById,
  useGoBack,
  useGoToTheRoute,
} from '@/hooks';
import { useManageTopicsStore } from '@/stores/ManageTopicsStoreProvider';

import { EditAnswerForm } from './EditAnswerForm';
import { TFormData } from './types';

interface TEditAnswerCardProps {
  availableTopicQuery: ReturnType<typeof useAvailableTopicById>;
  availableQuestionQuery: ReturnType<typeof useAvailableQuestionById>;
  availableAnswersQuery: ReturnType<typeof useAvailableAnswers>;
  availableAnswerQuery: ReturnType<typeof useAvailableAnswerById>;
}

export function EditAnswerCard(props: TEditAnswerCardProps) {
  const {
    availableTopicQuery,
    availableQuestionQuery,
    availableAnswersQuery,
    availableAnswerQuery,
  } = props;
  const { manageScope } = useManageTopicsStore();

  const queryClient = useQueryClient();

  const [hasDeleted, setHasDeleted] = React.useState(false);

  const { topic } = availableTopicQuery;
  const { question } = availableQuestionQuery;
  const { answer } = availableAnswerQuery;

  if (!topic) {
    throw new Error(`No topic found`);
  }
  if (!question) {
    throw new Error(`No question foundId}`);
  }
  if (!answer) {
    throw new Error(`No answer found}`);
  }

  // Calculate paths...
  const topicsListRoutePath = `/topics/${manageScope}`;
  const topicRoutePath = `${topicsListRoutePath}/${topic.id}`;
  const questionsListRoutePath = `${topicRoutePath}/questions`;
  const questionRoutePath = `${questionsListRoutePath}/${question.id}`;
  const answersListRoutePath = `${questionRoutePath}/answers`;
  // const answerRoutePath = `${answersListRoutePath}/${answer.id}`;

  const goToTheRoute = useGoToTheRoute();
  const goBack = useGoBack(answersListRoutePath);

  // Watch if the answer has been deleted
  React.useEffect(() => {
    const handleAnswerDeleted = (event: CustomEvent<TAnswer>) => {
      const { id } = event.detail;
      // Make sure the event is for this topic
      if (answer.id === id) {
        setHasDeleted(true);
      }
    };
    window.addEventListener(topicAnswerDeletedEventId, handleAnswerDeleted as EventListener);
    return () => {
      window.removeEventListener(topicAnswerDeletedEventId, handleAnswerDeleted as EventListener);
    };
  }, [answer.id]);

  // Effect:hasDeleted
  React.useEffect(() => {
    if (hasDeleted) {
      goBack();
    }
  }, [goBack, hasDeleted]);

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
      startTransition(async () => {
        try {
          const promise = updateAnswer(editedAnswer);
          toast.promise(promise, {
            loading: 'Saving the answer data...',
            success: 'Successfully saved the answer',
            error: 'Can not save the answer data.',
          });
          const updatedAnswer = await promise;
          // Invalidate all possible answer data...
          const invalidatePrefixes = [
            ['available-answer', editedAnswer.id],
            '["available-answers', // All available question queries
          ].map(makeQueryKeyPrefix);
          invalidateKeysByPrefixes(queryClient, invalidatePrefixes);
          // Update the item to the cached react-query data
          availableAnswersQuery.updateAnswer(updatedAnswer);
          // Invalidate all other keys...
          availableAnswersQuery.invalidateAllKeysExcept([availableAnswersQuery.queryKey]);
          // Reset form to the current data
          form.reset(form.getValues());
        } catch (error) {
          const details = error instanceof APIError ? error.details : null;
          const message = 'Cannot save answer data';
          // eslint-disable-next-line no-console
          console.error('[EditAnswerForm]', message, {
            details,
            error,
            answerId: editedAnswer.id,
          });
          debugger; // eslint-disable-line no-debugger
        }
      });
    },
    [answer, queryClient, availableAnswersQuery, form],
  );

  const handleReload = React.useCallback(() => {
    availableAnswerQuery
      .refetch()
      .then((res) => {
        const answer = res.data;
        if (answer) {
          form.reset(answer as TFormData);
          // Add the created item to the cached react-query data
          availableAnswersQuery.updateAnswer(answer);
          // Invalidate all other keys...
          availableAnswersQuery.invalidateAllKeysExcept([availableAnswersQuery.queryKey]);
        }
      })
      .catch((error) => {
        const message = 'Cannot update answer data';
        // eslint-disable-next-line no-console
        console.error('[EditAnswerCard:handleReload]', message, {
          error,
        });
        debugger; // eslint-disable-line no-debugger
        toast.error(message);
      });
  }, [availableAnswersQuery, availableAnswerQuery, form]);

  const actions: TActionMenuItem[] = React.useMemo(
    () => [
      {
        id: 'Back',
        content: 'Back',
        variant: 'ghost',
        icon: Icons.ArrowLeft,
        visibleFor: 'sm',
        onClick: goBack,
      },
      {
        id: 'Save',
        content: 'Save',
        variant: 'success',
        icon: Icons.Check,
        visibleFor: 'md',
        disabled: !isSubmitEnabled,
        pending: isPending,
        onClick: form.handleSubmit(handleFormSubmit),
      },
      {
        id: 'Reload',
        content: 'Reload',
        title: 'Reload the data from the server',
        variant: 'ghost',
        icon: Icons.Refresh,
        visibleFor: 'xl',
        pending: availableAnswerQuery.isRefetching,
        onClick: handleReload,
      },
      {
        id: 'Add New Answer',
        content: 'Add New Answer',
        variant: 'success',
        icon: Icons.Add,
        visibleFor: 'xl',
        onClick: () => goToTheRoute(`${answersListRoutePath}/add`),
      },
      {
        id: 'Generate Answers',
        content: 'Generate Answers',
        variant: 'secondary',
        icon: Icons.WandSparkles,
        visibleFor: 'xl',
        onClick: () => goToTheRoute(`${answersListRoutePath}/generate`),
      },
      {
        id: 'Reset',
        content: 'Reset changes',
        variant: 'ghost',
        icon: Icons.Close,
        // visibleFor: 'xl',
        onClick: () => form.reset(),
        hidden: !form.formState.isDirty,
      },
      {
        id: 'Delete Answer',
        content: 'Delete Answer',
        variant: 'destructive',
        icon: Icons.Trash,
        // visibleFor: 'xl',
        onClick: () => goToTheRoute(`${answersListRoutePath}/delete?answerId=${answer.id}`),
      },
    ],
    [
      goBack,
      isSubmitEnabled,
      isPending,
      form,
      handleFormSubmit,
      availableAnswerQuery.isRefetching,
      handleReload,
      goToTheRoute,
      answersListRoutePath,
      answer.id,
    ],
  );

  const breadcrumbs = useAnswersBreadcrumbsItems({
    scope: manageScope,
    // isLoading: !topic || !question || !answer,
    topic: topic,
    question: question,
    answer: answer,
  });

  return (
    <>
      <DashboardHeader
        heading="Edit Answer"
        className={cn(
          isDev && '__EditAnswerCard_DashboardHeader', // DEBUG
          'mx-6',
        )}
        breadcrumbs={breadcrumbs}
        actions={actions}
      />
      <Card
        className={cn(
          isDev && '__EditAnswerCard_Card', // DEBUG
          'relative mx-6 flex flex-1 flex-col overflow-hidden py-6 xl:col-span-2',
        )}
      >
        <EditAnswerForm
          className={cn(
            isDev && '__EditAnswerCard_Form_Content', // DEBUG
          )}
          form={form}
          handleFormSubmit={handleFormSubmit}
          isPending={isPending}
        />
      </Card>
    </>
  );
}
