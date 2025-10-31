'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { APIError } from '@/lib/types/api';
import { invalidateKeysByPrefixes, makeQueryKeyPrefix } from '@/lib/helpers/react-query';
import { cn } from '@/lib/utils';
import { useAvailableQuestions } from '@/hooks/react-query/useAvailableQuestions';
import { DialogDescription, DialogTitle } from '@/components/ui/Dialog';
import { Modal } from '@/components/ui/Modal';
import { isDev } from '@/constants';
import { useSettings } from '@/contexts/SettingsContext';
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

  const { jumpToNewEntities } = useSettings();

  const pathname = usePathname();
  const match = pathname.match(urlTopicIdRegExp);
  const shouldBeVisible = !!match; // pathname.endsWith(urlPostfix);
  const topicId = match?.[1];

  const topicsListRoutePath = `/topics/${manageScope}`;
  const topicRoutePath = `${topicsListRoutePath}/${topicId}`;
  const questionsListRoutePath = `${topicRoutePath}/questions`;

  const { isMobile } = useMediaQuery();

  const goToTheRoute = useGoToTheRoute();
  const goBack = useGoBack(questionsListRoutePath);

  const hideModal = React.useCallback(() => {
    setVisible(false);
    goBack();
  }, [goBack]);

  const availableQuestionsQuery = useAvailableQuestions({ topicId });
  const queryClient = useQueryClient();

  useModalTitle('Add a Question', shouldBeVisible);
  useUpdateModalVisibility(setVisible, shouldBeVisible);

  const addQuestionMutation = useMutation<TQuestion, Error, TNewQuestion>({
    mutationFn: addNewQuestion,
    onSuccess: (addedQuestion) => {
      // Add the created item to the cached react-query data
      availableQuestionsQuery.addNewQuestion(addedQuestion, true);
      // Invalidate all other queries...
      availableQuestionsQuery.invalidateAllKeysExcept([availableQuestionsQuery.queryKey]);
      const invalidatePrefixes = [
        // Invalidate parent topic and topics list...
        ['available-topic', topicId],
        ['available-topics'],
      ].map(makeQueryKeyPrefix);
      invalidateKeysByPrefixes(queryClient, invalidatePrefixes);
      // Close modal and navigate
      setVisible(false);
      if (jumpToNewEntities) {
        const returnUrl = `${questionsListRoutePath}/${addedQuestion.id}`;
        // setTimeout(() => goToTheRoute(returnUrl, true), 100);
        goToTheRoute(returnUrl, true);
      } else {
        goBack();
      }
    },
    onError: (error, newQuestion) => {
      const details = error instanceof APIError ? error.details : null;
      const message = 'Cannot create question';
      // eslint-disable-next-line no-console
      console.error('[AddQuestionModal:addQuestionMutation]', message, {
        error,
        details,
        newQuestion,
        topicId,
      });
      debugger; // eslint-disable-line no-debugger
    },
  });

  const handleAddQuestion = React.useCallback(
    (newQuestion: TNewQuestion) => {
      const promise = addQuestionMutation.mutateAsync(newQuestion);
      toast.promise(promise, {
        loading: 'Creating a new question...',
        success: 'Successfully created a new question.',
        error: 'Can not create a new question',
      });
      return promise;
    },
    [addQuestionMutation],
  );

  if (!shouldBeVisible || !topicId) {
    return null;
  }

  return (
    <Modal
      isVisible={isVisible}
      hideModal={hideModal}
      className={cn(
        isDev && '__AddQuestionModal', // DEBUG
        'flex flex-col gap-0 text-theme-foreground',
        addQuestionMutation.isPending && '[&>*]:pointer-events-none [&>*]:opacity-50',
      )}
    >
      <div
        className={cn(
          isDev && '__AddQuestionModal_Header', // DEBUG
          !isMobile && 'max-h-[90vh]',
          'flex flex-col border-b bg-theme px-6 py-4 text-theme-foreground',
        )}
      >
        <DialogTitle className="DialogTitle">Add New Question</DialogTitle>
        <DialogDescription aria-hidden="true" hidden>
          Add question dialog
        </DialogDescription>
      </div>
      <AddQuestionForm
        handleAddQuestion={handleAddQuestion}
        className="flex flex-col p-6 text-foreground"
        handleClose={hideModal}
        isPending={addQuestionMutation.isPending}
        topicId={topicId}
      />
    </Modal>
  );
}
