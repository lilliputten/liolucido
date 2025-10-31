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
import { isDev } from '@/constants';
import { useSettings } from '@/contexts/SettingsContext';
import { addNewAnswer } from '@/features/answers/actions';
import { TAvailableAnswer, TNewAnswer } from '@/features/answers/types';
import {
  useAvailableAnswers,
  useGoBack,
  useGoToTheRoute,
  useMediaQuery,
  useModalTitle,
  useUpdateModalVisibility,
} from '@/hooks';
import { useManageTopicsStore } from '@/stores/ManageTopicsStoreProvider';

import { AddAnswerForm } from './AddAnswerForm';

// Url example: /en/topics/my/[topicId]/questions/[questionId]/answers/add
const urlPostfix = '/answers/add';
const urlQuestionToken = '/questions/';
const idToken = '([^/]*)';
const urlRegExp = new RegExp(idToken + urlQuestionToken + idToken + urlPostfix + '$');

export function AddAnswerModal() {
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

  const { isMobile } = useMediaQuery();

  const goToTheRoute = useGoToTheRoute();
  const goBack = useGoBack(answersListRoutePath);

  const hideModal = React.useCallback(() => {
    setVisible(false);
    goBack();
  }, [goBack]);

  const availableAnswersQuery = useAvailableAnswers({ questionId });
  const queryClient = useQueryClient();

  useModalTitle('Add an Answer', shouldBeVisible);
  useUpdateModalVisibility(setVisible, shouldBeVisible);

  const addAnswerMutation = useMutation<TAvailableAnswer, Error, TNewAnswer>({
    mutationFn: addNewAnswer,
    onSuccess: (addedAnswer) => {
      // Add the created item to the cached react-query data
      availableAnswersQuery.addNewAnswer(addedAnswer, true);
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
        const continueUrl = `${answersListRoutePath}/${addedAnswer.id}`;
        goToTheRoute(continueUrl, true);
      } else {
        goBack();
      }
    },
    onError: (error, newAnswer) => {
      const details = error instanceof APIError ? error.details : null;
      const message = 'Cannot create answer';
      // eslint-disable-next-line no-console
      console.error('[AddAnswerModal:addAnswerMutation]', message, {
        error,
        details,
        newAnswer,
        questionId,
      });
      debugger; // eslint-disable-line no-debugger
    },
  });

  const handleAddAnswer = React.useCallback(
    (newAnswer: TNewAnswer) => {
      const promise = addAnswerMutation.mutateAsync(newAnswer);
      toast.promise(promise, {
        loading: 'Creating a new answer...',
        success: 'Successfully created a new answer.',
        error: 'Cannot create answer',
      });
      return promise;
    },
    [addAnswerMutation],
  );

  if (!shouldBeVisible || !topicId || !questionId) {
    return null;
    // throw new Error('Cannot parse topic id from the modal url.');
  }

  return (
    <Modal
      isVisible={isVisible}
      hideModal={hideModal}
      className={cn(
        isDev && '__AddAnswerModal', // DEBUG
        'flex flex-col gap-0 text-theme-foreground',
        addAnswerMutation.isPending && '[&>*]:pointer-events-none [&>*]:opacity-50',
      )}
    >
      <div
        className={cn(
          isDev && '__AddAnswerModal_Header', // DEBUG
          !isMobile && 'max-h-[90vh]',
          'flex flex-col border-b bg-theme px-6 py-4 text-theme-foreground',
        )}
      >
        <DialogTitle className="DialogTitle">Add New Answer</DialogTitle>
        <DialogDescription aria-hidden="true" hidden>
          Add Answer Dialog
        </DialogDescription>
      </div>
      <AddAnswerForm
        handleAddAnswer={handleAddAnswer}
        className="flex flex-col p-6 text-foreground"
        handleClose={hideModal}
        isPending={addAnswerMutation.isPending}
        questionId={questionId}
      />
    </Modal>
  );
}
