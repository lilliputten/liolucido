'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { truncateMarkdown } from '@/lib/helpers';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { deletedQuestionEventName, TDeletedQuestionDetail } from '@/constants/eventTypes';
import { useQuestionsContext } from '@/contexts/QuestionsContext';
import { deleteQuestion } from '@/features/questions/actions/deleteQuestion';
import { TQuestion, TQuestionId } from '@/features/questions/types';

import { topicQuestionDeletedEventId } from './constants';

interface TDeleteQuestionModalProps {
  questionId?: TQuestionId;
  from?: string;
}

export function DeleteQuestionModal(props: TDeleteQuestionModalProps) {
  const { questionId } = props;
  const router = useRouter();
  const [isVisible, setIsVisible] = React.useState(true);
  const questionsContext = useQuestionsContext();
  const { questions } = questionsContext;
  const hideModal = React.useCallback(() => {
    setIsVisible(false);
    const { href } = window.location;
    router.back();
    setTimeout(() => {
      // If still on the same page after trying to go back, fallback
      if (document.visibilityState === 'visible' && href === window.location.href) {
        // TODO: To use `from` parameter?
        router.push(questionsContext.routePath);
      }
    }, 200);
  }, [router, questionsContext]);
  if (!questionId) {
    throw new Error('No question id passed for deletion');
  }
  const deletingQuestion: TQuestion | undefined = React.useMemo(
    () => questions.find(({ id }) => id === questionId),
    [questionId, questions],
  );
  const [isPending, startUpdating] = React.useTransition();

  // Change a browser title
  React.useEffect(() => {
    const originalTitle = document.title;
    document.title = 'Delete a Question?';
    return () => {
      document.title = originalTitle;
    };
  }, []);

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
              // Update data
              questionsContext.setQuestions((questions) => {
                const updatedQuestions = questions.filter(({ id }) => id != deletingQuestion.id);
                // Dispatch a custom event with the updated questions data
                const { topicId } = questionsContext;
                const questionsCount = updatedQuestions.length;
                const deletedQuestionId = deletingQuestion.id;
                const detail: TDeletedQuestionDetail = {
                  topicId,
                  deletedQuestionId,
                  questionsCount,
                };
                const event = new CustomEvent<TDeletedQuestionDetail>(deletedQuestionEventName, {
                  detail,
                  bubbles: true,
                });
                setTimeout(() => window.dispatchEvent(event), 100);
                // Return data to update a state
                return updatedQuestions;
              });
              resolve(deletingQuestion);
              // Dispatch an event
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

  const questionName = deletingQuestion && truncateMarkdown(deletingQuestion.text, 30);

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
      Do you confirm deleting the question "{questionName}"?
    </ConfirmModal>
  );
}
