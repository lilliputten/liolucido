'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';

import { APIError } from '@/lib/types/api';
import { cn } from '@/lib/utils';
import { useAvailableQuestions } from '@/hooks/react-query/useAvailableQuestions';
import { DialogDescription, DialogTitle } from '@/components/ui/Dialog';
import { Modal } from '@/components/ui/Modal';
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
const idToken = '([^/]*)';
const urlTopicIdRegExp = new RegExp(idToken + urlPostfix + '$');

export function AddQuestionModal() {
  const { manageScope } = useManageTopicsStore();
  const [isVisible, setVisible] = React.useState(false);

  const pathname = usePathname();
  const match = pathname.match(urlTopicIdRegExp);
  const shouldBeVisible = !!match; // pathname.endsWith(urlPostfix);
  const topicId = match?.[1];

  if (!topicId) {
    throw new Error('Not found topic id');
  }

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
        return startUpdating(async () => {
          try {
            const promise = addNewQuestion(newQuestion);
            toast.promise<TQuestion>(promise, {
              loading: 'Creating a new question...',
              success: 'Successfully created a new question.',
              error: 'Can not create a new question',
            });
            const addedQuestion = await promise;
            // Add the created item to the cached react-query data
            availableQuestionsQuery.addNewQuestion(addedQuestion, true);
            // Invalidate all other keys...
            availableQuestionsQuery.invalidateAllKeysExcept([availableQuestionsQuery.queryKey]);
            /* // Broadcast an event
             * const event = new CustomEvent<TAddedQuestionDetail>(addedQuestionEventName, {
             *   detail: { topicId, addedQuestionId: addedQuestion.id, questionsCount: ...Get from `addNewQuestion` results... },
             *   bubbles: true,
             * });
             * window.dispatchEvent(event);
             */
            // Resolve added data
            resolve(addedQuestion);
            // NOTE: Close or go to the edit page
            setVisible(false);
            const returnUrl = `${questionsListRoutePath}/${addedQuestion.id}`;
            setTimeout(() => goToTheRoute(returnUrl, true), 100);
          } catch (error) {
            const details = error instanceof APIError ? error.details : null;
            const message = 'Cannot create question';
            // eslint-disable-next-line no-console
            console.error('[AddQuestionModal:handleAddQuestion]', message, {
              error,
              details,
              newQuestion,
              topicId,
            });
            debugger; // eslint-disable-line no-debugger
            reject(error);
            throw error;
          }
        });
      });
    },
    [availableQuestionsQuery, goToTheRoute, questionsListRoutePath, topicId],
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
