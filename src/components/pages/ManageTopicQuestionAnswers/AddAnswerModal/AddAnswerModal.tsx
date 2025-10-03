'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';

import { APIError } from '@/shared/types/api';
import { cn } from '@/lib/utils';
import { DialogDescription, DialogTitle } from '@/components/ui/Dialog';
import { Modal } from '@/components/ui/Modal';
import { isDev } from '@/constants';
import { addNewAnswer } from '@/features/answers/actions';
import { TNewAnswer } from '@/features/answers/types';
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

  const pathname = usePathname();
  const match = pathname.match(urlRegExp);
  const shouldBeVisible = !!match; // pathname.endsWith(urlPostfix);
  const topicId = match?.[1];
  const questionId = match?.[2];

  if (!topicId) {
    throw new Error('Not found topic id');
  }
  if (!questionId) {
    throw new Error('Not found question id');
  }

  // Calculate paths...
  const topicsListRoutePath = `/topics/${manageScope}`;
  const topicRoutePath = `${topicsListRoutePath}/${topicId}`;
  const questionsListRoutePath = `${topicRoutePath}/questions`;
  const questionRoutePath = `${questionsListRoutePath}/${questionId}`;
  const answersListRoutePath = `${questionRoutePath}/answers`;
  // const answerRoutePath = `${answersListRoutePath}/${answerId}`;

  const [isPending, startUpdating] = React.useTransition();
  const { isMobile } = useMediaQuery();

  const goToTheRoute = useGoToTheRoute();
  const goBack = useGoBack(answersListRoutePath);

  const hideModal = React.useCallback(() => {
    setVisible(false);
    goBack();
  }, [goBack]);

  const availableAnswersQuery = useAvailableAnswers({ questionId });

  useModalTitle('Add an Answer', shouldBeVisible);
  useUpdateModalVisibility(setVisible, shouldBeVisible);

  const handleAddAnswer = React.useCallback(
    (newAnswer: TNewAnswer) => {
      return new Promise((resolve, reject) => {
        return startUpdating(async () => {
          try {
            const promise = addNewAnswer(newAnswer);
            toast.promise(promise, {
              loading: 'Creating a new answer...',
              success: 'Successfully created a new answer.',
              error: 'Cannot create answer',
            });
            const addedAnswer = await promise;
            // Add the created item to the cached react-query data
            availableAnswersQuery.addNewAnswer(addedAnswer, true);
            // Invalidate all other keys...
            availableAnswersQuery.invalidateAllKeysExcept([availableAnswersQuery.queryKey]);
            // Resolve data
            resolve(addedAnswer);
            // NOTE: Close or go to the edit page
            setVisible(false);
            const continueUrl = `${answersListRoutePath}/${addedAnswer.id}`;
            goToTheRoute(continueUrl, true);
          } catch (error) {
            const details = error instanceof APIError ? error.details : null;
            const message = 'Cannot create answer';
            // eslint-disable-next-line no-console
            console.error('[AddAnswerModal:handleAddAnswer]', message, {
              error,
              details,
              newAnswer,
              questionId,
            });
            debugger; // eslint-disable-line no-debugger
            reject(error);
          }
        });
      });
    },
    [answersListRoutePath, availableAnswersQuery, goToTheRoute, questionId],
  );

  if (!shouldBeVisible) {
    return null;
    // throw new Error('Cannot parse topic id from the modal url.');
  }

  return (
    <Modal
      isVisible={isVisible}
      hideModal={hideModal}
      className={cn(
        isDev && '__AddAnswerModal', // DEBUG
        'gap-0',
        isPending && '[&>*]:pointer-events-none [&>*]:opacity-50',
      )}
    >
      <div
        className={cn(
          isDev && '__AddAnswerModal_Header', // DEBUG
          !isMobile && 'max-h-[90vh]',
          'flex flex-col border-b bg-accent px-8 py-4',
        )}
      >
        <DialogTitle className="DialogTitle">Add New Answer</DialogTitle>
        <DialogDescription aria-hidden="true" hidden>
          Add Answer Dialog
        </DialogDescription>
      </div>
      <div className="flex flex-col px-8 py-4">
        <AddAnswerForm
          handleAddAnswer={handleAddAnswer}
          className="p-8"
          handleClose={hideModal}
          isPending={isPending}
          questionId={questionId}
        />
      </div>
    </Modal>
  );
}
