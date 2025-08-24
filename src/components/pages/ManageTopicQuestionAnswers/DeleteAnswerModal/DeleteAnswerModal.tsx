'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';

import { APIError } from '@/shared/types/api';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { deleteAnswer } from '@/features/answers/actions';
import { TAnswerId } from '@/features/answers/types';
import { useAvailableAnswers, useGoBack, useModalTitle, useUpdateModalVisibility } from '@/hooks';
import { useManageTopicsStore } from '@/stores/ManageTopicsStoreProvider';

import { topicAnswerDeletedEventId } from './constants';

interface TDeleteAnswerModalProps {
  answerId?: TAnswerId;
  from?: string;
}

const urlPostfix = '/answers/delete';
const urlQuestionToken = '/questions/';
const idToken = '([^/]*)';
const urlMatchRegExp = new RegExp(idToken + urlQuestionToken + idToken + urlPostfix);

export function DeleteAnswerModal(props: TDeleteAnswerModalProps) {
  const { manageScope } = useManageTopicsStore();
  const { answerId } = props;

  if (!answerId) {
    throw new Error('No answer id passed for deletion');
  }

  const [isVisible, setVisible] = React.useState(true);

  const pathname = usePathname();
  const match = pathname.match(urlMatchRegExp);
  const shouldBeVisible = pathname.endsWith(urlPostfix);
  const topicId = match?.[1];
  const questionId = match?.[2];

  if (!topicId) {
    throw new Error('Not found topic id');
  }
  if (!questionId) {
    throw new Error('No question id passed for deletion');
  }

  // Calculate paths...
  const topicsListRoutePath = `/topics/${manageScope}`;
  const topicRoutePath = `${topicsListRoutePath}/${topicId}`;
  const questionsListRoutePath = `${topicRoutePath}/questions`;
  const questionRoutePath = `${questionsListRoutePath}/${questionId}`;
  const answersListRoutePath = `${questionRoutePath}/answers`;
  // const answerRoutePath = `${answersListRoutePath}/${answerId}`;

  const goBack = useGoBack(answersListRoutePath);

  const hideModal = React.useCallback(() => {
    setVisible(false);
    goBack();
  }, [goBack]);

  const availableAnswersQuery = useAvailableAnswers({ questionId });

  useModalTitle('Delete a Question', shouldBeVisible);
  useUpdateModalVisibility(setVisible, shouldBeVisible);

  const [isPending, startUpdating] = React.useTransition();

  // Change a browser title
  React.useEffect(() => {
    const originalTitle = document.title;
    document.title = 'Delete an Answer?';
    return () => {
      document.title = originalTitle;
    };
  }, []);

  const confirmDeleteAnswer = React.useCallback(
    () =>
      new Promise<void>((resolve, reject) => {
        return startUpdating(async () => {
          try {
            const promise = deleteAnswer(answerId);
            toast.promise(promise, {
              loading: 'Deleting the answer...',
              success: 'Successfully deleted the answer.',
              error: `Can not delete the answer."`,
            });
            await promise;
            // Hide the modal
            hideModal();
            // Add the created item to the cached react-query data
            availableAnswersQuery.deleteAnswer(answerId);
            // Invalidate all other keys...
            availableAnswersQuery.invalidateAllKeysExcept([availableAnswersQuery.queryKey]);
            // Resolve added data
            resolve();
            // Dispatch a broadcast event
            const event = new CustomEvent<TAnswerId>(topicAnswerDeletedEventId, {
              detail: answerId,
              bubbles: true,
            });
            window.dispatchEvent(event);
          } catch (error) {
            const details = error instanceof APIError ? error.details : null;
            const message = 'Cannot delete answer';
            // eslint-disable-next-line no-console
            console.error('[DeleteAnswerModal:confirmDeleteAnswer]', message, {
              details,
              error,
              answerId: answerId,
            });
            debugger; // eslint-disable-line no-debugger
            reject(error);
          }
        });
      }),
    [answerId, availableAnswersQuery, hideModal],
  );

  // const answerName = deletingAnswer && truncateMarkdown(deletingAnswer.text, 30);

  if (!shouldBeVisible) {
    return null;
  }

  return (
    <ConfirmModal
      dialogTitle="Confirm delete answer"
      confirmButtonVariant="destructive"
      confirmButtonText="Delete"
      confirmButtonBusyText="Deleting"
      cancelButtonText="Cancel"
      handleClose={hideModal}
      handleConfirm={confirmDeleteAnswer}
      isPending={isPending}
      isVisible={isVisible}
    >
      Do you confirm deleting the answer?
    </ConfirmModal>
  );
}
