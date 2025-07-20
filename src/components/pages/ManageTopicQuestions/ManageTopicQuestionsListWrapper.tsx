'use client';

import React from 'react';

import { cn } from '@/lib/utils';
import { isDev } from '@/constants';
import { useQuestionsContext } from '@/contexts/QuestionsContext/QuestionsContext';
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
          onButtonClick={openAddQuestionModal}
          buttonTitle="Add Question"
          iconName="questions"
          title="No questions have been created yet"
          description="You dont have any questions yet. Add any question to your profile."
        />
      )}
    </div>
  );
}
