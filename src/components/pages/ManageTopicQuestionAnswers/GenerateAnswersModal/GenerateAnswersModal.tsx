'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

import { APIError } from '@/lib/types/api';
import { getErrorText } from '@/lib/helpers';
import { invalidateKeysByPrefixes, makeQueryKeyPrefix } from '@/lib/helpers/react-query';
import { cn } from '@/lib/utils';
import { DialogDescription, DialogTitle } from '@/components/ui/Dialog';
import { Modal } from '@/components/ui/Modal';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { WaitingSplash } from '@/components/ui/WaitingSplash';
import { isDev } from '@/constants';
import { useSettings } from '@/contexts/SettingsContext';
import { sendAiTextQuery } from '@/features/ai/actions/sendAiTextQuery';
import { createGenerateQuestionAnswersMessages } from '@/features/ai/helpers/createGenerateQuestionAnswersMessages';
import { parseGeneratedQuestionAnswers } from '@/features/ai/helpers/parseGeneratedQuestionAnswers';
import { TGenerateQuestionAnswersParams } from '@/features/ai/types/GenerateAnswersTypes';
import { addMultipleAnswers } from '@/features/answers/actions/addMultipleAnswers';
import { TAvailableAnswer, TNewAnswer } from '@/features/answers/types';
import { useIfGenerationAllowed } from '@/features/users/hooks/useIfGenerationAllowed';
import {
  useAvailableQuestionById,
  useGoBack,
  useGoToTheRoute,
  useMediaQuery,
  useModalTitle,
  useUpdateModalVisibility,
} from '@/hooks';
import { useManageTopicsStore } from '@/stores/ManageTopicsStoreProvider';

import { GenerateAnswersForm, TFormData } from './GenerateAnswersForm';

// Url example: /en/topics/my/[topicId]/questions/[questionId]/answers/generate
const urlPostfix = '/answers/generate';
const urlQuestionToken = '/questions/';
const idToken = '([^/]*)';
const urlRegExp = new RegExp(idToken + urlQuestionToken + idToken + urlPostfix + '$');

export function GenerateAnswersModal() {
  const { manageScope } = useManageTopicsStore();
  const [isVisible, setVisible] = React.useState(true);

  const { jumpToNewEntities } = useSettings();

  const pathname = usePathname();
  const match = pathname.match(urlRegExp);
  const topicId = match?.[1];
  const questionId = match?.[2];

  const ifGenerationAllowed = useIfGenerationAllowed();
  const shouldBeVisible = ifGenerationAllowed && !!match;

  const session = useSession();
  const isSessionLoading = session.status === 'loading';

  // Calculate paths...
  const topicsListRoutePath = `/topics/${manageScope}`;
  const topicRoutePath = `${topicsListRoutePath}/${topicId}`;
  const questionsListRoutePath = `${topicRoutePath}/questions`;
  const questionRoutePath = `${questionsListRoutePath}/${questionId}`;
  const answersListRoutePath = `${questionRoutePath}/answers`;
  // const answerRoutePath = `${answersListRoutePath}/${answerId}`;

  const queryClient = useQueryClient();

  const { isMobile } = useMediaQuery();

  const goToTheRoute = useGoToTheRoute();
  const goBack = useGoBack(answersListRoutePath);

  const hideModal = React.useCallback(() => {
    setVisible(false);
    goBack();
  }, [goBack]);

  const availableQuestionQuery = useAvailableQuestionById({
    id: questionId || '',
    includeTopic: true,
    includeAnswers: true,
    includeAnswersCount: true,
  });
  const { question, isFetched, isLoading } = availableQuestionQuery;
  const isQuestionPending = !isFetched || isLoading;

  const answers = question?.answers;

  useModalTitle('Generate Answers', shouldBeVisible);
  useUpdateModalVisibility(setVisible, shouldBeVisible);

  // const generateAnswersMutation = useMutation<TGeneratedAnswers, Error, TFormData>({
  const generateAnswersMutation = useMutation({
    mutationFn: async (formData: TFormData) => {
      const questionText = question?.text || '';
      const topicText = question?.topic?.name || '';
      const topicDescription = question?.topic?.description || '';
      const topicKeywords = question?.topic?.keywords || '';
      const params: TGenerateQuestionAnswersParams = {
        ...formData,
        topicText,
        topicDescription,
        topicKeywords,
        questionText,
        existedAnswers: answers?.map(({ isCorrect, explanation, text }) => ({
          isCorrect,
          explanation: explanation || null,
          text,
        })),
      };
      const { debugData } = formData;
      /* // DEBUG
       * const topic = question?.topic;
       * console.log('[GenerateAnswersModal:generateAnswersMutation] Start', {
       *   debugData,
       *   formData,
       *   params,
       *   topic,
       *   question,
       *   answers,
       * });
       */
      const messages = createGenerateQuestionAnswersMessages(params);
      /* // DEBUG
       * const __debugMessagesStr = messages.map(({ content }) => content).join('\n\n');
       * console.log('[GenerateAnswersModal:generateAnswersMutation] Created messages', {
       *   __debugMessagesStr,
       *   messages,
       *   params,
       * });
       */
      const queryData = await sendAiTextQuery(messages, { debugData });
      // const generatedAnswers = await generateQuestionAnswers(messages, debugData);
      /* console.log('[GenerateAnswersModal:generateAnswersMutation] Generated query data', {
       *   // content: queryData?.content,
       *   queryData,
       *   messages,
       *   params,
       * });
       */
      return queryData;
    },
    onError: (error, formData) => {
      const details = error instanceof APIError ? error.details : null;
      const message = 'Cannot generate answers';
      // eslint-disable-next-line no-console
      console.error('[GenerateAnswersModal:generateAnswersMutation]', message, {
        error,
        details,
        formData,
        questionId,
      });
      debugger; // eslint-disable-line no-debugger
    },
  });

  const addAnswersMutation = useMutation<TAvailableAnswer[], Error, TNewAnswer[]>({
    mutationFn: addMultipleAnswers,
    onError: (error, newAnswers) => {
      const details = error instanceof APIError ? error.details : null;
      const message = 'Cannot create answer';
      // eslint-disable-next-line no-console
      console.error('[AddAnswersModal:addAnswersMutation]', message, {
        error,
        details,
        newAnswers,
        questionId,
      });
      debugger; // eslint-disable-line no-debugger
    },
  });

  const handleGenerateAnswers = React.useCallback(
    async (formData: TFormData) => {
      try {
        if (!questionId) {
          toast.error('No question ID defined');
          return;
        }
        /* console.log('[GenerateAnswersModal:handleGenerateAnswers] Start', {
         *   formData,
         *   questionId,
         * });
         */
        const queryPromise = generateAnswersMutation.mutateAsync(formData);
        toast.promise(queryPromise, {
          loading: 'Retrieving AI generated data...',
          success: 'Successfully retrieved AI generated data',
          error: 'Can not retrieve AI generated data',
        });
        const queryData = await queryPromise;
        /* console.log('[GenerateAnswersModal:handleGenerateAnswers] Got query data', {
         *   queryData,
         * });
         */
        // Parsing answers...
        const answers = parseGeneratedQuestionAnswers(queryData);
        /* console.log('[GenerateAnswersModal:handleGenerateAnswers] Parsed answers', {
         *   answers,
         * });
         */
        const newAnswers: TNewAnswer[] = answers.map((answer) => ({
          ...answer,
          questionId,
          isGenerated: true,
        }));
        const addAnswersPromise = addAnswersMutation.mutateAsync(newAnswers);
        toast.promise(addAnswersPromise, {
          loading: 'Adding new answers...',
          success: 'Successfully added new answers',
          error: 'Cannot added answers',
        });
        await addAnswersPromise;
        /* console.log('[GenerateAnswersModal:handleGenerateAnswers] Answers added', {
         *   addedAnswers,
         * });
         */
        /* // UNUSED: Add the created items to the cached react-query data
         * addedAnswers.map((addedAnswer) => {
         *   availableAnswersQuery.addNewAnswer(addedAnswer, true);
         * });
         * // Invalidate all other queries...
         * availableAnswersQuery.invalidateAllKeysExcept([availableAnswersQuery.queryKey]);
         */
        // Invalidate parent question and its answers...
        const invalidatePrefixes = [
          ['available-question', questionId],
          ['available-answers-for-question', questionId],
        ].map(makeQueryKeyPrefix);
        invalidateKeysByPrefixes(queryClient, invalidatePrefixes);
        // Close modal and navigate out
        setVisible(false);
        if (jumpToNewEntities) {
          const continueUrl = `${answersListRoutePath}`;
          goToTheRoute(continueUrl, true);
        } else {
          goBack();
        }
        return addAnswersPromise;
      } catch (error) {
        const humanMsg = 'An error occurred while generating and adding question answers';
        const errMsg = [humanMsg, getErrorText(error)].filter(Boolean).join(': ');
        // eslint-disable-next-line no-console
        console.error('[GenerateAnswersModal] ❌', errMsg, {
          error,
        });
        debugger; // eslint-disable-line no-debugger
        toast.error(humanMsg);
      }
    },
    [
      addAnswersMutation,
      answersListRoutePath,
      generateAnswersMutation,
      goBack,
      goToTheRoute,
      jumpToNewEntities,
      queryClient,
      questionId,
    ],
  );

  if (!shouldBeVisible || !topicId || !questionId) {
    return null;
    // throw new Error('Cannot parse topic id from the modal url.');
  }

  const areMutationsPending = generateAnswersMutation.isPending || addAnswersMutation.isPending;
  const isOverallPending = isQuestionPending || areMutationsPending;

  return (
    <Modal
      isVisible={isVisible}
      hideModal={hideModal}
      className={cn(
        isDev && '__GenerateAnswersModal', // DEBUG
        'flex flex-col gap-0 text-theme-foreground',
        !isMobile && 'max-h-[90%]',
        isOverallPending && '[&>*]:pointer-events-none [&>*]:opacity-50',
      )}
    >
      <div
        className={cn(
          isDev && '__GenerateAnswersModal_Header', // DEBUG
          !isMobile && 'max-h-[90vh]',
          'flex flex-col border-b bg-theme px-6 py-4 text-theme-foreground',
        )}
      >
        <DialogTitle className="DialogTitle">Generate Answers</DialogTitle>
        <DialogDescription aria-hidden="true" hidden>
          Generate Answers Dialog
        </DialogDescription>
      </div>
      <div
        className={cn(
          isDev && '__GenerateAnswersModal_Wrapper', // DEBUG
          'relative flex min-h-24 flex-col overflow-hidden',
        )}
      >
        {!isSessionLoading && (
          <ScrollArea
            className={cn(
              isDev && '__GenerateAnswersModal_Scroll', // DEBUG
              'flex flex-1 flex-col',
            )}
          >
            <GenerateAnswersForm
              handleGenerateAnswers={handleGenerateAnswers}
              className="p-8"
              handleClose={hideModal}
              isPending={areMutationsPending}
              questionId={questionId}
              user={session.data?.user}
            />
          </ScrollArea>
        )}
        <WaitingSplash show={isOverallPending} />
      </div>
    </Modal>
  );
}
