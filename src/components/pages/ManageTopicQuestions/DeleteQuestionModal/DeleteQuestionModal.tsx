'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Modal } from '@/components/ui/modal';
import { isDev } from '@/constants';
import { useQuestionsContext } from '@/contexts/QuestionsContext';
import { deleteQuestion } from '@/features/questions/actions/deleteQuestion';
import { TQuestion, TQuestionId } from '@/features/questions/types';

import { DeleteQuestionForm } from './DeleteQuestionForm';

interface TDeleteQuestionModalProps {
  questionId?: TQuestionId;
}

export function DeleteQuestionModal(props: TDeleteQuestionModalProps) {
  const { questionId } = props;
  const router = useRouter();
  const { questions, setQuestions } = useQuestionsContext();
  const hideModal = React.useCallback(() => router.back(), [router]);
  // const hideModal = React.useCallback(() => router.replace(routePath), [routePath, router]);
  if (!questionId) {
    throw new Error('No question id passed for deletion');
  }
  const deletingQuestion: TQuestion | undefined = React.useMemo(
    () => questions.find(({ id }) => id === questionId),
    [questionId, questions],
  );
  const [isPending, startUpdating] = React.useTransition();
  const { isMobile } = useMediaQuery();

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
              setQuestions((questions) => questions.filter(({ id }) => id != deletingQuestion.id));
              resolve(deletingQuestion);
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
    [deletingQuestion, hideModal, setQuestions],
  );

  return (
    <Modal
      isVisible
      hideModal={hideModal}
      className={cn(
        isDev && '__DeleteQuestionModal', // DEBUG
        'gap-0',
        isPending && '[&>*]:pointer-events-none [&>*]:opacity-50',
      )}
    >
      <div
        className={cn(
          isDev && '__DeleteQuestionModal_Header', // DEBUG
          !isMobile && 'max-h-[90vh]',
          'flex flex-col border-b bg-accent px-8 py-4',
        )}
      >
        <DialogTitle className="DialogTitle">Delete Question?</DialogTitle>
        <DialogDescription aria-hidden="true" hidden>
          Delete question dialog
        </DialogDescription>
      </div>
      <div className="flex flex-col px-8 py-4">
        <DeleteQuestionForm
          // name={deletingQuestion?.name || ''}
          handleConfirm={confirmDeleteQuestion}
          className="p-8"
          handleClose={hideModal}
          isPending={isPending}
        />
      </div>
    </Modal>
  );
}
