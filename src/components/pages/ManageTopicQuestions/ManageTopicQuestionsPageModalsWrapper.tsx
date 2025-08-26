'use client';

import React from 'react';

import { cn } from '@/lib/utils';
import { isDev } from '@/constants';
import { TQuestionId } from '@/features/questions/types';
import { TTopicId } from '@/features/topics/types';
import { useGoToTheRoute } from '@/hooks';
import { useManageTopicsStore } from '@/stores/ManageTopicsStoreProvider';

import { ManageTopicQuestionsListCard } from './ManageTopicQuestionsListCard';

interface TTopicsListProps {
  topicId: TTopicId;
  showAddModal?: boolean;
  deleteQuestionId?: TQuestionId;
  editQuestionId?: TQuestionId;
  editAnswersQuestionId?: TQuestionId;
}

export function ManageTopicQuestionsPageModalsWrapper(props: TTopicsListProps) {
  const { topicId, showAddModal, deleteQuestionId, editQuestionId, editAnswersQuestionId } = props;

  const { manageScope } = useManageTopicsStore();
  const topicsListRoutePath = `/topics/${manageScope}`;
  const topicRoutePath = `${topicsListRoutePath}/${topicId}`;
  const questionsListRoutePath = `${topicRoutePath}/questions`;

  const goToTheRoute = useGoToTheRoute();

  // Add New Question Modal
  const openAddQuestionModal = React.useCallback(() => {
    const url = `${questionsListRoutePath}/add`;
    goToTheRoute(url, true);
  }, [goToTheRoute, questionsListRoutePath]);
  React.useEffect(() => {
    if (showAddModal) {
      openAddQuestionModal();
    }
  }, [showAddModal, openAddQuestionModal]);

  // Delete Question Modal
  const openDeleteQuestionModal = React.useCallback(
    (questionId: TQuestionId) => {
      const url = `${questionsListRoutePath}/delete?questionId=${questionId}`;
      goToTheRoute(url);
    },
    [goToTheRoute, questionsListRoutePath],
  );
  React.useEffect(() => {
    if (deleteQuestionId) {
      openDeleteQuestionModal(deleteQuestionId);
    }
  }, [deleteQuestionId, openDeleteQuestionModal]);

  // Edit Question Card
  const openEditQuestionCard = React.useCallback(
    (questionId: TQuestionId) => {
      const url = `${questionsListRoutePath}/${questionId}/edit`;
      goToTheRoute(url);
    },
    [goToTheRoute, questionsListRoutePath],
  );
  React.useEffect(() => {
    if (editQuestionId) {
      openEditQuestionCard(editQuestionId);
    }
  }, [editQuestionId, openEditQuestionCard]);

  // Edit Answers Page
  const openEditAnswersPage = React.useCallback(
    (questionId: TQuestionId) => {
      const url = `${questionsListRoutePath}/${questionId}/answers`;
      goToTheRoute(url);
    },
    [goToTheRoute, questionsListRoutePath],
  );
  React.useEffect(() => {
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
      topicId={topicId}
      handleDeleteQuestion={openDeleteQuestionModal}
      handleEditQuestion={openEditQuestionCard}
      handleAddQuestion={openAddQuestionModal}
      handleEditAnswers={openEditAnswersPage}
    />
  );
}
