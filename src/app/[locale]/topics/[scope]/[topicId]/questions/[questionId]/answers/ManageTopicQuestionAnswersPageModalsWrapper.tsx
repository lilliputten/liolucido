'use client';

import React from 'react';

import { TAnswerId } from '@/features/answers/types';
import { TQuestionId } from '@/features/questions/types';
import { TTopicId } from '@/features/topics/types';
import { useGoToTheRoute } from '@/hooks';
import { useManageTopicsStore } from '@/stores/ManageTopicsStoreProvider';

import { ManageTopicQuestionAnswersPageHolder } from './ManageTopicQuestionAnswersPageHolder';

interface TTopicsListProps {
  topicId: TTopicId;
  questionId: TQuestionId;
  showAddModal?: boolean;
  deleteAnswerId?: TAnswerId;
  editAnswerId?: TAnswerId;
}

export function ManageTopicQuestionAnswersPageModalsWrapper(props: TTopicsListProps) {
  const { manageScope } = useManageTopicsStore();
  const { topicId, questionId, showAddModal, deleteAnswerId, editAnswerId } = props;

  // Calculate paths...
  const topicsListRoutePath = `/topics/${manageScope}`;
  const topicRoutePath = `${topicsListRoutePath}/${topicId}`;
  const questionsListRoutePath = `${topicRoutePath}/questions`;
  const questionRoutePath = `${questionsListRoutePath}/${questionId}`;
  const answersListRoutePath = `${questionRoutePath}/answers`;
  // const answerRoutePath = `${answersListRoutePath}/${answerId}`;

  const goToTheRoute = useGoToTheRoute();

  // Add Answer Modal
  const openAddAnswerModal = React.useCallback(() => {
    const url = `${answersListRoutePath}/add`;
    goToTheRoute(url);
  }, [answersListRoutePath, goToTheRoute]);
  React.useEffect(() => {
    if (showAddModal) {
      openAddAnswerModal();
    }
  }, [showAddModal, openAddAnswerModal]);

  // Delete Answer Modal
  const openDeleteAnswerModal = React.useCallback(
    (answerId: TAnswerId) => {
      const url = `${answersListRoutePath}/delete?answerId=${answerId}`;
      goToTheRoute(url);
    },
    [answersListRoutePath, goToTheRoute],
  );
  React.useEffect(() => {
    if (deleteAnswerId) {
      openDeleteAnswerModal(deleteAnswerId);
    }
  }, [deleteAnswerId, openDeleteAnswerModal]);

  // Edit Answer Card
  const openEditAnswerCard = React.useCallback(
    (answerId: TAnswerId) => {
      const url = `${answersListRoutePath}/${answerId}/edit`;
      goToTheRoute(url);
    },
    [answersListRoutePath, goToTheRoute],
  );
  React.useEffect(() => {
    if (editAnswerId) {
      openEditAnswerCard(editAnswerId);
    }
  }, [editAnswerId, openEditAnswerCard]);

  return (
    <ManageTopicQuestionAnswersPageHolder
      topicId={topicId}
      questionId={questionId}
      // answers={answers}
      // handleDeleteAnswer={openDeleteAnswerModal}
      // handleEditAnswer={openEditAnswerCard}
      // handleAddAnswer={openAddAnswerModal}
    />
  );
}
