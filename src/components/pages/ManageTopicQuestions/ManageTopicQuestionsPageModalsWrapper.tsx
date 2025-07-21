'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { useQuestionsContext } from '@/contexts/QuestionsContext';
import { TQuestionId } from '@/features/questions/types';

import { ManageTopicQuestionsListWrapper } from './ManageTopicQuestionsListWrapper';

interface TTopicsListProps {
  showAddModal?: boolean;
  deleteQuestionId?: TQuestionId;
  editQuestionId?: TQuestionId;
}

export function ManageTopicQuestionsPageModalsWrapper(props: TTopicsListProps) {
  const router = useRouter();
  const { showAddModal, deleteQuestionId, editQuestionId } = props;
  const questionsContext = useQuestionsContext();

  // Add Question Modal
  const openAddQuestionModal = React.useCallback(() => {
    router.push(questionsContext.routePath + '/add');
  }, [router, questionsContext]);
  React.useEffect(() => {
    if (showAddModal) {
      openAddQuestionModal();
    }
  }, [showAddModal, openAddQuestionModal, questionsContext]);

  // Delete Question Modal
  const openDeleteQuestionModal = React.useCallback(
    (questionId: TQuestionId) => {
      const hasQuestion = questionsContext.questions.find(({ id }) => id === questionId);
      if (hasQuestion) {
        router.push(`${questionsContext.routePath}/delete?id=${questionId}`);
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

  return (
    <ManageTopicQuestionsListWrapper
      openAddQuestionModal={openAddQuestionModal}
      openDeleteQuestionModal={openDeleteQuestionModal}
      openEditQuestionCard={openEditQuestionCard}
    />
  );
}
