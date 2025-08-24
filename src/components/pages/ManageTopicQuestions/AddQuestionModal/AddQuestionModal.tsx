'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';

import { getErrorText } from '@/lib/helpers/strings';
import { cn } from '@/lib/utils';
import { useAvailableQuestions } from '@/hooks/react-query/useAvailableQuestions';
import { DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Modal } from '@/components/ui/modal';
import { isDev } from '@/constants';
import { addNewQuestion } from '@/features/questions/actions';
import { TNewQuestion, TQuestion } from '@/features/questions/types';
import {
  useGoBack,
  useGoToTheRoute,
  useMediaQuery,
  useModalTitle,
  useUpdateModalVisibility,
} from '@/hooks';
import { useManageTopicsStore } from '@/stores/ManageTopicsStoreProvider';

import { AddQuestionForm } from './AddQuestionForm';

const urlPostfix = '/questions/add';
const urlTopicIdRegExp = new RegExp('([^/]*)' + urlPostfix);

export function AddQuestionModal() {
  const { manageScope } = useManageTopicsStore();
  const [isVisible, setVisible] = React.useState(false);
  const pathname = usePathname();
  const shouldBeVisible = pathname.endsWith(urlPostfix);
  const match = pathname.match(urlTopicIdRegExp);
  const topicId = match?.[1];

  const topicsListRoutePath = `/topics/${manageScope}`;
  const topicRoutePath = `${topicsListRoutePath}/${topicId}`;
  const questionsListRoutePath = `${topicRoutePath}/questions`;

  const [isPending, startUpdating] = React.useTransition();
  const { isMobile } = useMediaQuery();

  const goToTheRoute = useGoToTheRoute();
  const goBack = useGoBack(questionsListRoutePath);

  const hideModal = React.useCallback(() => {
    setVisible(false);
    goBack();
  }, [goBack]);

  const availableQuestionsQuery = useAvailableQuestions({ topicId });

  useModalTitle('Add a Question', shouldBeVisible);
  useUpdateModalVisibility(setVisible, shouldBeVisible);

  const handleAddQuestion = React.useCallback(
    (newQuestion: TNewQuestion) => {
      return new Promise((resolve, reject) => {
        return startUpdating(() => {
          const promise = addNewQuestion(newQuestion)
            .then((addedQuestion) => {
              /* // UNUSED: Old way: via QuestionsContext: Update topics list
               * questionsContext.setQuestions((questions) => {
               *   const updatedQuestions = questions.concat(addedQuestion);
               *   // Dispatch a custom event with the updated questions data
               *   const { topicId } = questionsContext;
               *   const questionsCount = updatedQuestions.length;
               *   const addedQuestionId = addedQuestion.id;
               *   const detail: TAddedQuestionDetail = { topicId, addedQuestionId, questionsCount };
               *   const event = new CustomEvent<TAddedQuestionDetail>(addedQuestionEventName, {
               *     detail,
               *     bubbles: true,
               *   });
               *   setTimeout(() => window.dispatchEvent(event), 100);
               *   // Return data to update a state
               *   return updatedQuestions;
               * });
               */
              // Add the created item to the cached react-query data
              availableQuestionsQuery.addNewQuestion(addedQuestion, true);
              // Invalidate all other keys...
              availableQuestionsQuery.invalidateAllKeysExcept([availableQuestionsQuery.queryKey]);
              // Resolve added data
              resolve(addedQuestion);
              // NOTE: Close or go to the edit page
              setVisible(false);
              const returnUrl = `${questionsListRoutePath}/${addedQuestion.id}`;
              setTimeout(() => goToTheRoute(returnUrl, true), 100);
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
    [availableQuestionsQuery, goToTheRoute, questionsListRoutePath],
  );

  if (!shouldBeVisible || !topicId) {
    return null;
    // throw new Error('Cannot parse topic id from the modal url.');
  }

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
