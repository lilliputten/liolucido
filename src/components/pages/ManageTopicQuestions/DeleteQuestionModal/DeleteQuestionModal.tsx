'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { limitString } from '@/lib/helpers/strings';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { useQuestionsContext } from '@/contexts/QuestionsContext';
import { deleteQuestion } from '@/features/questions/actions/deleteQuestion';
import { TQuestion, TQuestionId } from '@/features/questions/types';

import { topicQuestionDeletedEventId } from './constants';

interface TDeleteQuestionModalProps {
  questionId?: TQuestionId;
}

export function DeleteQuestionModal(props: TDeleteQuestionModalProps) {
  const { questionId } = props;
  const router = useRouter();
  const [isVisible, setIsVisible] = React.useState(true);
  const questionsContext = useQuestionsContext();
  const { questions } = questionsContext;
  // const hideModal = React.useCallback(() => router.back(), [router]);
  const hideModal = React.useCallback(() => {
    setIsVisible(false);
    router.back();
    // const routePath = questionsContext.routePath;
    // router.replace(routePath);
  }, [router]);
  if (!questionId) {
    throw new Error('No question id passed for deletion');
  }
  const deletingQuestion: TQuestion | undefined = React.useMemo(
    () => questions.find(({ id }) => id === questionId),
    [questionId, questions],
  );
  const [isPending, startUpdating] = React.useTransition();

  const confirmDeleteQuestion = React.useCallback(
    () =>
      new Promise((resolve, reject) => {
        return startUpdating(() => {
          if (!deletingQuestion) {
            reject(new Error('No question to delete provided'));
            return;
          }
          const promise = deleteQuestion(deletingQuestion)
            .then(() => {
              // Hide the modal
              hideModal();
              /* console.log('[DeleteQuestionModal:handleQuestionDeleted]', {
               *   topicQuestionDeletedEventId,
               *   questionsContext,
               * });
               */
              // Update data
              questionsContext.setQuestions((questions) =>
                questions.filter(({ id }) => id != deletingQuestion.id),
              );
              resolve(deletingQuestion);
              // Dispatch a custom event with the selected language data
              const event = new CustomEvent<TQuestion>(topicQuestionDeletedEventId, {
                detail: deletingQuestion,
                bubbles: true,
              });
              window.dispatchEvent(event);
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
    [deletingQuestion, hideModal, questionsContext],
  );

  const questionName = deletingQuestion && limitString(deletingQuestion.text, 30);
  React.useEffect(() => {
    console.log('[DeleteQuestionModal:DEBUG]', {
      isVisible,
      questionName,
      deletingQuestion,
    });
  }, [
    // DEBUG
    isVisible,
    questionName,
    deletingQuestion,
  ]);

  if (!questionName) {
    return null;
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
      Are you confirming deleting the question "{questionName}"?
    </ConfirmModal>
  );
}
