'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';

import { useAvailableQuestions } from '@/hooks/react-query/useAvailableQuestions';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { deleteQuestion } from '@/features/questions/actions/deleteQuestion';
import { TQuestionId } from '@/features/questions/types';
import { useGoBack, useModalTitle, useUpdateModalVisibility } from '@/hooks';
import { useManageTopicsStore } from '@/stores/ManageTopicsStoreProvider';

interface TDeleteQuestionModalProps {
  questionId?: TQuestionId;
  from?: string;
}

const urlPostfix = '/questions/delete';
const urlMatchRegExp = new RegExp('([^/]*)' + urlPostfix); // + '\\b\\?([^/]*)$');

export function DeleteQuestionModal(props: TDeleteQuestionModalProps) {
  const { manageScope } = useManageTopicsStore();
  const { questionId } = props;
  const [isVisible, setVisible] = React.useState(true);

  const pathname = usePathname();
  const match = pathname.match(urlMatchRegExp);
  const shouldBeVisible = pathname.endsWith(urlPostfix);
  const topicId = match?.[1];

  const topicsListRoutePath = `/topics/${manageScope}`;
  const topicRoutePath = `${topicsListRoutePath}/${topicId}`;
  const questionsListRoutePath = `${topicRoutePath}/questions`;

  const goBack = useGoBack(questionsListRoutePath);

  const hideModal = React.useCallback(() => {
    setVisible(false);
    goBack();
  }, [goBack]);

  const availableQuestionsQuery = useAvailableQuestions({ topicId });

  useModalTitle('Delete a Question', shouldBeVisible);
  useUpdateModalVisibility(setVisible, shouldBeVisible);

  if (!topicId) {
    throw new Error('Not found topic id');
  }
  if (!questionId) {
    throw new Error('No question id passed for deletion');
  }

  const [isPending, startUpdating] = React.useTransition();

  const confirmDeleteQuestion = React.useCallback(
    () =>
      new Promise<void>((resolve, reject) => {
        return startUpdating(() => {
          /* if (!deletingQuestion) {
           *   reject(new Error('No question provided to deletion'));
           *   return;
           * }
           */
          const promise = deleteQuestion(questionId)
            .then(() => {
              /* // UNUSED: Update data via QuestionsContext
               * questionsContext.setQuestions((questions) => {
               *   const updatedQuestions = questions.filter(({ id }) => id != deletingQuestion.id);
               *   // Return data to update a state
               *   return updatedQuestions;
               * });
               */
              // Add the created item to the cached react-query data
              availableQuestionsQuery.deleteQuestion(questionId);
              // Invalidate all other keys...
              availableQuestionsQuery.invalidateAllKeysExcept([availableQuestionsQuery.queryKey]);
              // Resolve added data
              resolve();
              /* // Broadcast an event
               * const event = new CustomEvent<TQuestion>(topicQuestionDeletedEventId, {
               *   detail: deletingQuestion,
               *   bubbles: true,
               * });
               * window.dispatchEvent(event);
               */
              // Hide the modal
              hideModal();
            })
            .catch((error) => {
              // eslint-disable-next-line no-console
              console.error('[DeleteQuestionModal:confirmDeleteQuestion:catch]', {
                error,
              });
              debugger; // eslint-disable-line no-debugger
              reject(error);
              throw error;
            });
          toast.promise(promise, {
            loading: 'Deleting the question...',
            success: 'Successfully deleted the question.',
            error: `Can not delete the question."`,
          });
        });
      }),
    [questionId, availableQuestionsQuery, hideModal],
  );

  if (!shouldBeVisible || !topicId || !questionId) {
    return null;
    // throw new Error('Cannot parse topic id from the modal url.');
  }

  return (
    <ConfirmModal
      dialogTitle="Confirm delete question"
      confirmButtonVariant="destructive"
      confirmButtonText="Delete"
      confirmButtonBusyText="Deleting"
      cancelButtonText="Cancel"
      handleClose={hideModal}
      handleConfirm={confirmDeleteQuestion}
      isPending={isPending}
      isVisible={isVisible}
    >
      Do you confirm the deletion of the question?
    </ConfirmModal>
  );
}
