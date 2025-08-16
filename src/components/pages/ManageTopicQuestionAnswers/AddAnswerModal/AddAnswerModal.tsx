'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { APIError } from '@/shared/types/api';
import { handleServerAction } from '@/lib/api';
import { invalidateReactQueryKeys } from '@/lib/data';
import { getErrorText } from '@/lib/helpers/strings';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Modal } from '@/components/ui/modal';
import { isDev } from '@/constants';
import { addedAnswerEventName, TAddedAnswerDetail } from '@/constants/eventTypes';
import { useAnswersContext } from '@/contexts/AnswersContext';
import { addNewAnswer } from '@/features/answers/actions';
import { TAnswer, TNewAnswer } from '@/features/answers/types';
import { usePathname } from '@/i18n/routing';

import { AddAnswerForm } from './AddAnswerForm';

export function AddAnswerModal() {
  const [isVisible, setVisible] = React.useState(false);
  const router = useRouter();
  const hideModal = React.useCallback(() => {
    setVisible(false);
    router.back();
  }, [router]);
  const [isPending, startUpdating] = React.useTransition();
  const { isMobile } = useMediaQuery();

  const answersContext = useAnswersContext();
  const { questionId } = answersContext;

  // Check if we're still on the add route
  const pathname = usePathname();
  const isAddRoute = pathname?.endsWith('/add');

  // Check if the modal should be visible
  React.useEffect(() => {
    setVisible(isAddRoute);
    if (isAddRoute) {
      const originalTitle = document.title;
      document.title = 'Add an Answer';
      return () => {
        setVisible(false);
        document.title = originalTitle;
      };
    }
  }, [isAddRoute]);

  const handleAddAnswer = React.useCallback(
    (newAnswer: TNewAnswer) => {
      return new Promise((resolve, reject) => {
        return startUpdating(() => {
          const promise = handleServerAction(addNewAnswer(newAnswer), {
            onInvalidateKeys: invalidateReactQueryKeys,
            debugDetails: {
              initiator: 'AddAnswerModal',
              action: 'addNewAnswer',
              questionId,
            },
          })
            .then((result) => {
              if (result.ok && result.data) {
                const addedAnswer = result.data;
                // Update topics list
                answersContext.setAnswers((answers) => {
                  const updatedAnswers = answers.concat(addedAnswer);
                  // Dispatch a custom event with the updated answers data
                  const answersCount = updatedAnswers.length;
                  const addedAnswerId = addedAnswer.id;
                  const detail: TAddedAnswerDetail = { questionId, addedAnswerId, answersCount };
                  const event = new CustomEvent<TAddedAnswerDetail>(addedAnswerEventName, {
                    detail,
                    bubbles: true,
                  });
                  setTimeout(() => window.dispatchEvent(event), 100);
                  // Return data to update a state
                  return updatedAnswers;
                });
                // Resolve data
                resolve(addedAnswer);
                // NOTE: Close or go to the edit page
                setVisible(false);
                router.replace(`${answersContext.routePath}/${addedAnswer.id}`);
                return addedAnswer;
              } else {
                reject(new Error('Failed to create answer'));
              }
            })
            .catch((error) => {
              const details = error instanceof APIError ? error.details : null;
              const message = 'Cannot create answer';
              // eslint-disable-next-line no-console
              console.error('[AddAnswerModal]', message, {
                details,
                error,
                newAnswer,
                questionId,
              });
              debugger; // eslint-disable-line no-debugger
              reject(error);
            });
          toast.promise(promise, {
            loading: 'Creating a new answer...',
            success: 'Successfully created a new answer.',
            error: 'Can not create a new answer',
          });
        });
      });
    },
    [answersContext, questionId, router],
  );

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
