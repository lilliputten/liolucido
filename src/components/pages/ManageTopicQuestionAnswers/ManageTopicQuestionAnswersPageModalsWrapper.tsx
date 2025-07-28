'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { useAnswersContext } from '@/contexts/AnswersContext';
import { TAnswerId } from '@/features/answers/types';

import { ManageTopicQuestionAnswersListWrapper } from './ManageTopicQuestionAnswersListWrapper';

interface TTopicsListProps {
  topicId: string;
  showAddModal?: boolean;
  deleteAnswerId?: TAnswerId;
  editAnswerId?: TAnswerId;
}

export function ManageTopicQuestionAnswersPageModalsWrapper(props: TTopicsListProps) {
  const router = useRouter();
  const { topicId, showAddModal, deleteAnswerId, editAnswerId } = props;
  const answersContext = useAnswersContext();

  // Add Answer Modal
  const openAddAnswerModal = React.useCallback(() => {
    router.push(answersContext.routePath + '/add');
  }, [router, answersContext]);
  React.useEffect(() => {
    if (showAddModal) {
      openAddAnswerModal();
    }
  }, [showAddModal, openAddAnswerModal, answersContext]);

  // Delete Answer Modal
  const openDeleteAnswerModal = React.useCallback(
    (answerId: TAnswerId) => {
      const hasAnswer = answersContext.answers.find(({ id }) => id === answerId);
      if (hasAnswer) {
        router.push(`${answersContext.routePath}/delete?answerId=${answerId}`);
      } else {
        toast.error('The requested answer does not exist.');
        router.replace(answersContext.routePath);
      }
    },
    [router, answersContext],
  );
  React.useEffect(() => {
    if (deleteAnswerId) {
      openDeleteAnswerModal(deleteAnswerId);
    }
  }, [deleteAnswerId, openDeleteAnswerModal]);

  // Edit Answer Card
  const openEditAnswerCard = React.useCallback(
    (answerId: TAnswerId) => {
      const hasAnswer = answersContext.answers.find(({ id }) => id === answerId);
      if (hasAnswer) {
        router.push(`${answersContext.routePath}/${answerId}/edit`);
      } else {
        toast.error('The requested answer does not exist.');
        router.replace(answersContext.routePath);
      }
    },
    [router, answersContext],
  );
  React.useEffect(() => {
    if (editAnswerId) {
      openEditAnswerCard(editAnswerId);
    }
  }, [editAnswerId, openEditAnswerCard]);

  return (
    <ManageTopicQuestionAnswersListWrapper
      topicId={topicId}
      openAddAnswerModal={openAddAnswerModal}
      openDeleteAnswerModal={openDeleteAnswerModal}
      openEditAnswerCard={openEditAnswerCard}
    />
  );
}
