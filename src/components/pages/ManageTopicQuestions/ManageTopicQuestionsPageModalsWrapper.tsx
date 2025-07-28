'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { useQuestionsContext } from '@/contexts/QuestionsContext';
import { TQuestionId } from '@/features/questions/types';

import { ManageTopicQuestionsListWrapper } from './ManageTopicQuestionsListWrapper';

interface TTopicsListProps {
  topicId: string;
  showAddModal?: boolean;
  deleteQuestionId?: TQuestionId;
  editQuestionId?: TQuestionId;
  editAnswersQuestionId?: TQuestionId;
}

export function ManageTopicQuestionsPageModalsWrapper(props: TTopicsListProps) {
  const router = useRouter();
  const { topicId, showAddModal, deleteQuestionId, editQuestionId, editAnswersQuestionId } = props;
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
    <ManageTopicQuestionsListWrapper
      topicId={topicId}
      openAddQuestionModal={openAddQuestionModal}
      openDeleteQuestionModal={openDeleteQuestionModal}
      openEditQuestionCard={openEditQuestionCard}
      openEditAnswersPage={openEditAnswersPage}
    />
  );
}
