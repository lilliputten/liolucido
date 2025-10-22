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
import { createGenerateTopicQuestionsMessages } from '@/features/ai/helpers/createGenerateTopicQuestionsMessages';
import { parseGeneratedTopicQuestions } from '@/features/ai/helpers/parseGeneratedTopicQuestions';
import { TGenerateTopicQuestionsParams } from '@/features/ai/types/GenerateQuestionsTypes';
import { addMultipleQuestions } from '@/features/questions/actions/addMultipleQuestions';
import { TAvailableQuestion, TNewQuestion } from '@/features/questions/types';
import { useIfGenerationAllowed } from '@/features/users/hooks/useIfGenerationAllowed';
import {
  useAvailableTopicById,
  useGoBack,
  useGoToTheRoute,
  useMediaQuery,
  useModalTitle,
  useUpdateModalVisibility,
} from '@/hooks';
import { useManageTopicsStore } from '@/stores/ManageTopicsStoreProvider';

import { GenerateQuestionsForm, TFormData } from './GenerateQuestionsForm';

// Url example: /en/topics/my/[topicId]/questions/generate
const urlPostfix = '/questions/generate';
const urlTopicsToken = '/topics/';
const idToken = '([^/]*)';
const urlRegExp = new RegExp(urlTopicsToken + idToken + '/' + idToken + urlPostfix + '$');

export function GenerateQuestionsModal() {
  const { manageScope } = useManageTopicsStore();
  const [isVisible, setVisible] = React.useState(true);

  const { jumpToNewEntities } = useSettings();

  const pathname = usePathname();
  const match = pathname.match(urlRegExp);
  const topicId = match?.[2];

  const ifGenerationAllowed = useIfGenerationAllowed();
  const shouldBeVisible = ifGenerationAllowed && !!match;

  const session = useSession();
  const isSessionLoading = session.status === 'loading';

  // Calculate paths...
  const topicsListRoutePath = `/topics/${manageScope}`;
  const topicRoutePath = `${topicsListRoutePath}/${topicId}`;
  const questionsListRoutePath = `${topicRoutePath}/questions`;

  const queryClient = useQueryClient();

  const { isMobile } = useMediaQuery();

  const goToTheRoute = useGoToTheRoute();
  const goBack = useGoBack(questionsListRoutePath);

  const hideModal = React.useCallback(() => {
    setVisible(false);
    goBack();
  }, [goBack]);

  const availableTopicQuery = useAvailableTopicById({
    id: topicId || '',
    includeQuestions: true,
    includeQuestionsCount: true,
  });
  const { topic, isFetched, isLoading } = availableTopicQuery;
  const isTopicPending = !isFetched || isLoading;

  const questions = topic?.questions;

  useModalTitle('Generate Questions', shouldBeVisible);
  useUpdateModalVisibility(setVisible, shouldBeVisible);

  const generateQuestionsMutation = useMutation({
    mutationFn: async (formData: TFormData) => {
      const topicText = topic?.name || '';
      const topicDescription = topic?.description || '';
      const topicKeywords = topic?.keywords || '';
      const params: TGenerateTopicQuestionsParams = {
        ...formData,
        topicText,
        topicDescription,
        topicKeywords,
        existedQuestions: questions?.map(({ text }) => ({ text })),
      };
      const { debugData } = formData;
      /* console.log('[GenerateQuestionsModal:generateQuestionsMutation] Start', {
       *   debugData,
       *   formData,
       *   params,
       *   topic,
       *   questions,
       * });
       */
      const messages = createGenerateTopicQuestionsMessages(params);
      /* // DEBUG
       * const __debugMessagesStr = messages.map(({ content }) => content).join('\n\n');
       * console.log('[GenerateQuestionsModal:generateQuestionsMutation] Created messages', {
       *   __debugMessagesStr,
       *   messages,
       *   params,
       * });
       */
      const queryData = await sendAiTextQuery(messages, { debugData });
      /* // DEBUG
       * const content = __queryData?.content;
       * console.log('[GenerateQuestionsModal:generateQuestionsMutation] Generated query data', {
       *   __content,
       *   queryData,
       *   messages,
       *   params,
       * });
       */
      return queryData;
    },
    onError: (error, formData) => {
      const details = error instanceof APIError ? error.details : null;
      const message = 'Cannot generate questions';
      // eslint-disable-next-line no-console
      console.error('[GenerateQuestionsModal:generateQuestionsMutation]', message, {
        error,
        details,
        formData,
        topicId,
      });
      debugger; // eslint-disable-line no-debugger
    },
  });

  const addQuestionsMutation = useMutation<TAvailableQuestion[], Error, TNewQuestion[]>({
    mutationFn: addMultipleQuestions,
    onError: (error, newQuestions) => {
      const details = error instanceof APIError ? error.details : null;
      const message = 'Cannot create questions';
      // eslint-disable-next-line no-console
      console.error('[GenerateQuestionsModal:addQuestionsMutation]', message, {
        error,
        details,
        newQuestions,
        topicId,
      });
      debugger; // eslint-disable-line no-debugger
    },
  });

  const handleGenerateQuestions = React.useCallback(
    async (formData: TFormData) => {
      try {
        if (!topicId) {
          toast.error('No topic ID defined');
          return;
        }
        /* console.log('[GenerateQuestionsModal:handleGenerateQuestions] Start', {
         *   formData,
         *   topicId,
         * });
         */
        const queryPromise = generateQuestionsMutation.mutateAsync(formData);
        toast.promise(queryPromise, {
          loading: 'Retrieving AI generated data...',
          success: 'Successfully retrieved AI generated data',
          error: 'Can not retrieve AI generated data',
        });
        const queryData = await queryPromise;
        /* console.log('[GenerateQuestionsModal:handleGenerateQuestions] Got query data', {
         *   queryData,
         * });
         */
        // Parsing questions...
        const questions = parseGeneratedTopicQuestions(queryData);
        const newQuestions: TNewQuestion[] = questions.map(
          ({
            answers,
            //  answersCount,
            ...question
          }) => ({
            ...question,
            answers: answers.map((answer) => ({ ...answer, isGenerated: true })),
            topicId,
            isGenerated: true,
          }),
        );
        /* console.log('[GenerateQuestionsModal:handleGenerateQuestions] Parsed questions', {
         *   newQuestions,
         *   questions,
         * });
         */
        const addQuestionsPromise = addQuestionsMutation.mutateAsync(newQuestions);
        toast.promise(addQuestionsPromise, {
          loading: 'Adding new questions...',
          success: 'Successfully added new questions',
          error: 'Cannot add questions',
        });
        await addQuestionsPromise;
        /* console.log('[GenerateQuestionsModal:handleGenerateQuestions] Questions added', {
         *   addedQuestions,
         * });
         */
        // Invalidate parent topic and its questions...
        const invalidatePrefixes = [
          ['available-topic', topicId],
          ['available-questions-for-topic', topicId],
        ].map(makeQueryKeyPrefix);
        invalidateKeysByPrefixes(queryClient, invalidatePrefixes);
        // Close modal and navigate out
        setVisible(false);
        if (jumpToNewEntities) {
          const continueUrl = `${questionsListRoutePath}`;
          goToTheRoute(continueUrl, true);
        } else {
          goBack();
        }
        return addQuestionsPromise;
      } catch (error) {
        const humanMsg = 'An error occurred while generating and adding topic questions';
        const errMsg = [humanMsg, getErrorText(error)].filter(Boolean).join(': ');
        // eslint-disable-next-line no-console
        console.error('[GenerateQuestionsModal] ❌', errMsg, {
          error,
        });
        debugger; // eslint-disable-line no-debugger
        toast.error(humanMsg);
      }
    },
    [
      addQuestionsMutation,
      generateQuestionsMutation,
      goBack,
      goToTheRoute,
      jumpToNewEntities,
      queryClient,
      questionsListRoutePath,
      topicId,
    ],
  );

  if (!shouldBeVisible || !topicId) {
    return null;
  }

  const areMutationsPending = generateQuestionsMutation.isPending || addQuestionsMutation.isPending;
  const isOverallPending = isTopicPending || areMutationsPending;

  return (
    <Modal
      isVisible={isVisible}
      hideModal={hideModal}
      className={cn(
        isDev && '__GenerateQuestionsModal',
        'flex flex-col gap-0 text-theme-foreground',
        !isMobile && 'max-h-[90%]',
        isOverallPending && '[&>*]:pointer-events-none [&>*]:opacity-50',
      )}
    >
      <div
        className={cn(
          isDev && '__GenerateQuestionsModal_Header',
          !isMobile && 'max-h-[90vh]',
          'flex flex-col border-b bg-theme px-6 py-4 text-theme-foreground',
        )}
      >
        <DialogTitle className="DialogTitle">Generate Questions</DialogTitle>
        <DialogDescription aria-hidden="true" hidden>
          Generate Questions Dialog
        </DialogDescription>
      </div>
      <div
        className={cn(
          isDev && '__GenerateQuestionsModal_Wrapper', // DEBUG
          'relative flex min-h-24 flex-col overflow-hidden',
        )}
      >
        {!isSessionLoading && (
          <ScrollArea
            className={cn(
              isDev && '__GenerateQuestionsModal_Scroll', // DEBUG
              'flex flex-1 flex-col',
            )}
          >
            <GenerateQuestionsForm
              handleGenerateQuestions={handleGenerateQuestions}
              className="p-8"
              handleClose={hideModal}
              isPending={areMutationsPending}
              topicId={topicId}
              user={session.data?.user}
            />
          </ScrollArea>
        )}
        <WaitingSplash show={isOverallPending} />
      </div>
    </Modal>
  );
}
