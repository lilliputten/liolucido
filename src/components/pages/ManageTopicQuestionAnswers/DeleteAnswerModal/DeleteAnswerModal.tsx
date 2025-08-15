'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { truncateMarkdown } from '@/lib/helpers';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { deletedAnswerEventName, TDeletedAnswerDetail } from '@/constants/eventTypes';
import { useAnswersContext } from '@/contexts/AnswersContext';
import { deleteAnswer } from '@/features/answers/actions/deleteAnswer';
import { TAnswer, TAnswerId } from '@/features/answers/types';

import { topicAnswerDeletedEventId } from './constants';

interface TDeleteAnswerModalProps {
  answerId?: TAnswerId;
  from?: string;
}

export function DeleteAnswerModal(props: TDeleteAnswerModalProps) {
  const { answerId } = props;
  const router = useRouter();
  const [isVisible, setIsVisible] = React.useState(true);
  const answersContext = useAnswersContext();
  const { answers } = answersContext;
  const hideModal = React.useCallback(() => {
    setIsVisible(false);
    const { href } = window.location;
    router.back();
    setTimeout(() => {
      // If still on the same page after trying to go back, fallback
      if (document.visibilityState === 'visible' && href === window.location.href) {
        // TODO: To use `from` parameter?
        router.push(answersContext.routePath);
      }
    }, 200);
  }, [router, answersContext]);
  if (!answerId) {
    throw new Error('No answer id passed for deletion');
  }
  const deletingAnswer: TAnswer | undefined = React.useMemo(
    () => answers.find(({ id }) => id === answerId),
    [answerId, answers],
  );
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
      new Promise((resolve, reject) => {
        return startUpdating(() => {
          if (!deletingAnswer) {
            reject(new Error('No answer to delete provided'));
            return;
          }
          const promise = deleteAnswer(deletingAnswer)
            .then(() => {
              // Hide the modal
              hideModal();
              // Update data
              answersContext.setAnswers((answers) => {
                const updatedAnswers = answers.filter(({ id }) => id != deletingAnswer.id);
                // Dispatch a custom event with the updated answers data
                const { questionId } = answersContext;
                const answersCount = updatedAnswers.length;
                const deletedAnswerId = deletingAnswer.id;
                const detail: TDeletedAnswerDetail = { questionId, deletedAnswerId, answersCount };
                const event = new CustomEvent<TDeletedAnswerDetail>(deletedAnswerEventName, {
                  detail,
                  bubbles: true,
                });
                setTimeout(() => window.dispatchEvent(event), 100);
                // Return data to update a state
                return updatedAnswers;
              });
              resolve(deletingAnswer);
              // Dispatch an event
              const event = new CustomEvent<TAnswer>(topicAnswerDeletedEventId, {
                detail: deletingAnswer,
                bubbles: true,
              });
              window.dispatchEvent(event);
            })
            .catch((error) => {
              // eslint-disable-next-line no-console
              console.error('[DeleteAnswerModal:confirmDeleteAnswer:catch]', {
                error,
              });
              debugger; // eslint-disable-line no-debugger
              reject(error);
              throw error;
            });
          toast.promise(promise, {
            loading: 'Deleting the answer...',
            success: 'Successfully deleted the answer.',
            error: `Can not delete the answer."`,
          });
        });
      }),
    [deletingAnswer, hideModal, answersContext],
  );

  const answerName = deletingAnswer && truncateMarkdown(deletingAnswer.text, 30);

  if (!answerName) {
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
      Do you confirm deleting the answer "{answerName}"?
    </ConfirmModal>
  );
}
