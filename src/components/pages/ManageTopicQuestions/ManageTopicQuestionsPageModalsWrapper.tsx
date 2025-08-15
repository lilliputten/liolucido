'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import { isDev } from '@/constants';
import { useQuestionsContext } from '@/contexts/QuestionsContext';
import { TQuestionId } from '@/features/questions/types';

import { ManageTopicQuestionsListCard } from './ManageTopicQuestionsListCard';

interface TTopicsListProps {
  showAddModal?: boolean;
  deleteQuestionId?: TQuestionId;
  editQuestionId?: TQuestionId;
  editAnswersQuestionId?: TQuestionId;
}

export function ManageTopicQuestionsPageModalsWrapper(props: TTopicsListProps) {
  const router = useRouter();
  const { showAddModal, deleteQuestionId, editQuestionId, editAnswersQuestionId } = props;
  const questionsContext = useQuestionsContext();

  // Add New Question Modal
  const openAddQuestionModal = React.useCallback(() => {
    router.push(questionsContext.routePath + '/add');
  }, [router, questionsContext]);
  React.useEffect(() => {
    if (showAddModal) {
      openAddQuestionModal();
    }
  }, [showAddModal, openAddQuestionModal]);

  // Delete Question Modal
  const openDeleteQuestionModal = React.useCallback(
    (questionId: TQuestionId) => {
      const hasQuestion = questionsContext.questions.find(({ id }) => id === questionId);
      if (hasQuestion) {
        router.push(`${questionsContext.routePath}/delete?questionId=${questionId}`);
      } else {
        toast.error('The requested question does not exist.');
        router.replace(questionsContext.routePath);
      }
    },
    [router, questionsContext],
  );
  React.useEffect(() => {
    if (deleteQuestionId) {
      openDeleteQuestionModal(deleteQuestionId);
    }
  }, [deleteQuestionId, openDeleteQuestionModal]);

  // Edit Question Card
  const openEditQuestionCard = React.useCallback(
    (questionId: TQuestionId) => {
      const hasQuestion = questionsContext.questions.find(({ id }) => id === questionId);
      if (hasQuestion) {
        router.push(`${questionsContext.routePath}/${questionId}/edit`);
      } else {
        toast.error('The requested question does not exist.');
        router.replace(questionsContext.routePath);
      }
    },
    [router, questionsContext],
  );
  React.useEffect(() => {
    if (editQuestionId) {
      openEditQuestionCard(editQuestionId);
    }
  }, [editQuestionId, openEditQuestionCard]);

  // Edit Answers Page
  const openEditAnswersPage = React.useCallback(
    (questionId: TQuestionId) => {
      const hasQuestion = questionsContext.questions.find(({ id }) => id === questionId);
      if (hasQuestion) {
        router.push(`${questionsContext.routePath}/${questionId}/answers`);
      } else {
        toast.error('The requested question does not exist.');
        router.replace(questionsContext.routePath);
      }
    },
    [router, questionsContext],
  );
  React.useEffect(() => {
    // Use another id (`editAnswersQuestionId`)?
    if (editAnswersQuestionId) {
      openEditAnswersPage(editAnswersQuestionId);
    }
  }, [editAnswersQuestionId, openEditAnswersPage]);

  return (
    <ManageTopicQuestionsListCard
      className={cn(
        isDev && '__ManageTopicQuestionsListWrapper_Card', // DEBUG
        'relative flex flex-1 flex-col overflow-hidden',
      )}
      questions={questionsContext.questions}
      handleDeleteQuestion={openDeleteQuestionModal}
      handleEditQuestion={openEditQuestionCard}
      handleAddQuestion={openAddQuestionModal}
      handleEditAnswers={openEditAnswersPage}
    />
  );
}
