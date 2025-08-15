'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { getErrorText } from '@/lib/helpers/strings';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Modal } from '@/components/ui/modal';
import { isDev } from '@/constants';
import { addedQuestionEventName, TAddedQuestionDetail } from '@/constants/eventTypes';
import { useQuestionsContext } from '@/contexts/QuestionsContext';
import { addNewQuestion } from '@/features/questions/actions';
import { TNewQuestion, TQuestion } from '@/features/questions/types';
import { usePathname } from '@/i18n/routing';

import { AddQuestionForm } from './AddQuestionForm';

export function AddQuestionModal(/* props: TAddQuestionModalProps */) {
  const [isVisible, setVisible] = React.useState(false);
  const router = useRouter();
  const hideModal = React.useCallback(() => {
    setVisible(false);
    router.back();
  }, [router]);
  const [isPending, startUpdating] = React.useTransition();
  const { isMobile } = useMediaQuery();

  const questionsContext = useQuestionsContext();
  const { topicId } = questionsContext;

  // Check if we're still on the add route
  const pathname = usePathname();
  const isAddRoute = pathname?.endsWith('/add');

  // Check if the modal should be visible
  React.useEffect(() => {
    setVisible(isAddRoute);
    if (isAddRoute) {
      const originalTitle = document.title;
      document.title = 'Add a Question';
      return () => {
        setVisible(false);
        document.title = originalTitle;
      };
    }
  }, [isAddRoute]);

  const handleAddQuestion = React.useCallback(
    (newQuestion: TNewQuestion) => {
      return new Promise((resolve, reject) => {
        return startUpdating(() => {
          const promise = addNewQuestion(newQuestion)
            .then((addedQuestion) => {
              // Update topics list
              questionsContext.setQuestions((questions) => {
                const updatedQuestions = questions.concat(addedQuestion);
                // Dispatch a custom event with the updated questions data
                const { topicId } = questionsContext;
                const questionsCount = updatedQuestions.length;
                const addedQuestionId = addedQuestion.id;
                const detail: TAddedQuestionDetail = { topicId, addedQuestionId, questionsCount };
                const event = new CustomEvent<TAddedQuestionDetail>(addedQuestionEventName, {
                  detail,
                  bubbles: true,
                });
                setTimeout(() => window.dispatchEvent(event), 100);
                // Return data to update a state
                return updatedQuestions;
              });
              resolve(addedQuestion);
              // NOTE: Close or go to the edit page
              setVisible(false);
              router.replace(`${questionsContext.routePath}/${addedQuestion.id}`);
              return addedQuestion;
            })
            .catch((error) => {
              // eslint-disable-next-line no-console
              console.error('[AddQuestionModal:handleAddQuestion:catch]', getErrorText(error), {
                error,
                newQuestion,
              });
              debugger; // eslint-disable-line no-debugger
              reject(error);
              throw error;
            });
          toast.promise<TQuestion>(promise, {
            loading: 'Creating a new question...',
            success: 'Successfully created a new question.',
            error: 'Can not create a new question',
          });
        });
      });
    },
    [questionsContext, router],
  );

  return (
    <Modal
      isVisible={isVisible}
      hideModal={hideModal}
      className={cn(
        isDev && '__AddQuestionModal', // DEBUG
        'gap-0',
        isPending && '[&>*]:pointer-events-none [&>*]:opacity-50',
      )}
    >
      <div
        className={cn(
          isDev && '__AddQuestionModal_Header', // DEBUG
          !isMobile && 'max-h-[90vh]',
          'flex flex-col border-b bg-accent px-8 py-4',
        )}
      >
        <DialogTitle className="DialogTitle">Add New Question</DialogTitle>
        <DialogDescription aria-hidden="true" hidden>
          Add question dialog
        </DialogDescription>
      </div>
      <div className="flex flex-col px-8 py-4">
        <AddQuestionForm
          handleAddQuestion={handleAddQuestion}
          className="p-8"
          handleClose={hideModal}
          isPending={isPending}
          topicId={topicId}
        />
      </div>
    </Modal>
  );
}
