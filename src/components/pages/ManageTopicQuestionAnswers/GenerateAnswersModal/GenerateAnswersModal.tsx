'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { APIError } from '@/lib/types/api';
import { invalidateKeysByPrefixes, makeQueryKeyPrefix } from '@/lib/helpers/react-query';
import { cn } from '@/lib/utils';
import { DialogDescription, DialogTitle } from '@/components/ui/Dialog';
import { Modal } from '@/components/ui/Modal';
import { WaitingSplash } from '@/components/ui/WaitingSplash';
import { isDev } from '@/constants';
import { useSettings } from '@/contexts/SettingsContext';
import {
  generateQuestionAnswers,
  TGeneratedAnswers,
  TGenerateQuestionAnswersParams,
} from '@/features/ai/actions/generateQuestionAnswers';
import { addMultipleAnswers } from '@/features/answers/actions/addMultipleAnswers';
import { TAvailableAnswer, TNewAnswer } from '@/features/answers/types';
import {
  useAvailableAnswers,
  useAvailableQuestionById,
  useGoBack,
  useGoToTheRoute,
  useMediaQuery,
  useModalTitle,
  useUpdateModalVisibility,
} from '@/hooks';
import { useManageTopicsStore } from '@/stores/ManageTopicsStoreProvider';

import { GenerateAnswersForm, TFormData } from './GenerateAnswersForm';

// Url example: /en/topics/my/[topicId]/questions/[questionId]/answers/generate
const urlPostfix = '/answers/generate';
const urlQuestionToken = '/questions/';
const idToken = '([^/]*)';
const urlRegExp = new RegExp(idToken + urlQuestionToken + idToken + urlPostfix + '$');

export function GenerateAnswersModal() {
  const { manageScope } = useManageTopicsStore();
  const [isVisible, setVisible] = React.useState(true);

  const { jumpToNewEntities } = useSettings();

  const pathname = usePathname();
  const match = pathname.match(urlRegExp);
  const topicId = match?.[1];
  const questionId = match?.[2];

  const shouldBeVisible = !!match; // pathname.endsWith(urlPostfix);

  // Calculate paths...
  const topicsListRoutePath = `/topics/${manageScope}`;
  const topicRoutePath = `${topicsListRoutePath}/${topicId}`;
  const questionsListRoutePath = `${topicRoutePath}/questions`;
  const questionRoutePath = `${questionsListRoutePath}/${questionId}`;
  const answersListRoutePath = `${questionRoutePath}/answers`;
  // const answerRoutePath = `${answersListRoutePath}/${answerId}`;

  const queryClient = useQueryClient();

  const { isMobile } = useMediaQuery();

  const goToTheRoute = useGoToTheRoute();
  const goBack = useGoBack(answersListRoutePath);

  const hideModal = React.useCallback(() => {
    setVisible(false);
    goBack();
  }, [goBack]);

  const availableAnswersQuery = useAvailableAnswers({ questionId });

  const availableQuestionQuery = useAvailableQuestionById({
    id: questionId || '',
    includeTopic: true,
    includeAnswers: true,
    includeAnswersCount: true,
  });
  const { question, isFetched, isLoading } = availableQuestionQuery;
  const isQuestionPending = !isFetched || isLoading;

  const answers = question?.answers;
  // const availableAnswersQuery = useAvailableAnswers({ questionId });
  // const queryClient = useQueryClient();

  console.log('[GenerateAnswersModal:DEBUG]', questionId, {
    shouldBeVisible,
    isQuestionPending,
    question,
    answers,
    questionId,
  });

  useModalTitle('Generate Answers', shouldBeVisible);
  useUpdateModalVisibility(setVisible, shouldBeVisible);

  const generateAnswersMutation = useMutation<TGeneratedAnswers, Error, TFormData>({
    mutationFn: async (formData: TFormData) => {
      const questionText = question?.text || '';
      const topicText = question?.topic?.name || '';
      const params: TGenerateQuestionAnswersParams = {
        ...formData,
        topicText,
        questionText,
      };
      const result = await generateQuestionAnswers(params);
      return result;
    },
    onError: (error, formData) => {
      const details = error instanceof APIError ? error.details : null;
      const message = 'Cannot generate answers';
      // eslint-disable-next-line no-console
      console.error('[GenerateAnswersModal:generateAnswersMutation]', message, {
        error,
        details,
        formData,
        questionId,
      });
      debugger; // eslint-disable-line no-debugger
    },
  });

  const addAnswersMutation = useMutation<TAvailableAnswer[], Error, TNewAnswer[]>({
    mutationFn: addMultipleAnswers,
    onError: (error, newAnswers) => {
      const details = error instanceof APIError ? error.details : null;
      const message = 'Cannot create answer';
      // eslint-disable-next-line no-console
      console.error('[AddAnswersModal:addAnswersMutation]', message, {
        error,
        details,
        newAnswers,
        questionId,
      });
      debugger; // eslint-disable-line no-debugger
    },
  });

  const handleGenerateAnswers = React.useCallback(
    async (formData: TFormData) => {
      if (!questionId) {
        toast.error('No question ID defined');
        return;
      }
      console.log('[GenerateAnswersModal:handleGenerateAnswers] start', {
        formData,
        questionId,
      });
      const promise1 = generateAnswersMutation.mutateAsync(formData);
      toast.promise(promise1, {
        loading: 'Generating new answers...',
        success: 'Successfully generated new answers',
        error: 'Cannot generate answers',
      });
      const result1 = await promise1;
      const { answers } = result1;
      console.log('[GenerateAnswersModal:handleGenerateAnswers] result1', {
        answers,
        result1,
      });
      const newAnswers: TNewAnswer[] = answers.map((a) => ({
        ...a,
        questionId,
        isGenerated: true,
      }));
      const promise2 = addAnswersMutation.mutateAsync(newAnswers);
      toast.promise(promise2, {
        loading: 'Adding new answers...',
        success: 'Successfully added new answers',
        error: 'Cannot added answers',
      });
      const addedAnswers = await promise2;
      console.log('[GenerateAnswersModal:handleGenerateAnswers] addedAnswers', {
        addedAnswers,
      });
      // Add the created item to the cached react-query data
      addedAnswers.map((addedAnswer) => {
        availableAnswersQuery.addNewAnswer(addedAnswer, true);
      });
      // Invalidate all other queries...
      availableAnswersQuery.invalidateAllKeysExcept([availableAnswersQuery.queryKey]);
      // Invalidate parent question...
      const invalidatePrefixes = [
        ['available-question', questionId],
        ['available-questions-for-topic', topicId],
      ].map(makeQueryKeyPrefix);
      invalidateKeysByPrefixes(queryClient, invalidatePrefixes);
      // Close modal and navigate
      setVisible(false);
      if (jumpToNewEntities) {
        const continueUrl = `${answersListRoutePath}`;
        goToTheRoute(continueUrl, true);
      } else {
        goBack();
      }
      return promise2;
    },
    [
      addAnswersMutation,
      answersListRoutePath,
      availableAnswersQuery,
      generateAnswersMutation,
      goBack,
      goToTheRoute,
      jumpToNewEntities,
      queryClient,
      questionId,
      topicId,
    ],
  );

  if (!shouldBeVisible || !topicId || !questionId) {
    return null;
    // throw new Error('Cannot parse topic id from the modal url.');
  }

  const areMutationsPending = generateAnswersMutation.isPending || addAnswersMutation.isPending;
  const isOverallPending = isQuestionPending || areMutationsPending;

  return (
    <Modal
      isVisible={isVisible}
      hideModal={hideModal}
      className={cn(
        isDev && '__GenerateAnswersModal', // DEBUG
        'gap-0 pb-4 text-theme-foreground',
        isOverallPending && '[&>*]:pointer-events-none [&>*]:opacity-50',
      )}
    >
      <div
        className={cn(
          isDev && '__GenerateAnswersModal_Header', // DEBUG
          !isMobile && 'max-h-[90vh]',
          'flex flex-col border-b bg-theme px-6 py-4 text-theme-foreground',
        )}
      >
        <DialogTitle className="DialogTitle">Generate Answers</DialogTitle>
        <DialogDescription aria-hidden="true" hidden>
          Generate Answers Dialog
        </DialogDescription>
      </div>
      <div className="relative flex flex-col px-8 py-4">
        <GenerateAnswersForm
          handleGenerateAnswers={handleGenerateAnswers}
          className="p-8"
          handleClose={hideModal}
          isPending={areMutationsPending}
          questionId={questionId}
        />
        <WaitingSplash show={isOverallPending} />
      </div>
    </Modal>
  );
}
