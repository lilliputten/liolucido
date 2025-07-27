'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/shared/icons';
import { isDev } from '@/constants';
import { useQuestionsContext } from '@/contexts/QuestionsContext';
import { TQuestionId } from '@/features/questions/types';

import { PageEmpty } from '../shared';
import { ManageTopicQuestionsListCard } from './ManageTopicQuestionsListCard';

interface TQuestionsListProps {
  openAddQuestionModal: () => void;
  openDeleteQuestionModal: (questionId: TQuestionId) => void;
  openEditQuestionCard: (questionId: TQuestionId) => void;
}

export function ManageTopicQuestionsListWrapper(props: TQuestionsListProps) {
  const { openAddQuestionModal, openDeleteQuestionModal, openEditQuestionCard } = props;
  const { questions } = useQuestionsContext();

  const hasQuestions = !!questions.length;

  const router = useRouter();
  const { topicsListRoutePath } = useQuestionsContext();
  const goBack = React.useCallback(() => {
    if (window.history.length) {
      router.back();
    } else {
      router.replace(topicsListRoutePath);
    }
  }, [router, topicsListRoutePath]);

  return (
    <div
      className={cn(
        isDev && '__ManageTopicQuestionsListWrapper', // DEBUG
        'relative flex flex-1 flex-col overflow-hidden',
      )}
    >
      {hasQuestions ? (
        <ManageTopicQuestionsListCard
          className={cn(
            isDev && '__ManageTopicQuestionsListWrapper_Card', // DEBUG
            'relative flex flex-1 flex-col overflow-hidden',
          )}
          questions={questions}
          handleDeleteQuestion={openDeleteQuestionModal}
          handleEditQuestion={openEditQuestionCard}
          handleAddQuestion={openAddQuestionModal}
        />
      ) : (
        <PageEmpty
          className="size-full flex-1"
          iconName="questions"
          title="No questions have been created yet"
          description="You dont have any questions yet. Add any question to your profile."
          buttons={
            <>
              <Button onClick={goBack} className="flex gap-2">
                <Icons.arrowLeft className="size-4" />
                Go Back
              </Button>
              <Button onClick={openAddQuestionModal} className="flex gap-2">
                <Icons.add className="size-4" />
                Add Question
              </Button>
            </>
          }
        />
      )}
    </div>
  );
}
