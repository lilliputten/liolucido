'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { useTopicsContext } from '@/contexts/TopicsContext/TopicsContext';
import { TTopicId } from '@/features/topics/types';

import { ManageTopicsListWrapper } from './ManageTopicsListWrapper';

interface TTopicsListProps {
  showAddModal?: boolean;
  deleteTopicId?: TTopicId;
  editTopicId?: TTopicId;
}

export function ManageTopicsPageModalsWrapper(props: TTopicsListProps) {
  const router = useRouter();
  const { showAddModal, deleteTopicId, editTopicId } = props;
  const topicsContext = useTopicsContext();

  // Add Topic Modal
  const openAddTopicModal = React.useCallback(() => {
    router.push(topicsContext.routePath + '/add');
  }, [router, topicsContext]);
  React.useEffect(() => {
    if (showAddModal) {
      openAddTopicModal();
    }
  }, [showAddModal, openAddTopicModal, topicsContext]);

  // Delete Topic Modal
  const openDeleteTopicModal = React.useCallback(
    (topicId: TTopicId) => {
      const hasTopic = topicsContext.topics.find(({ id }) => id === topicId);
      if (hasTopic) {
        router.push(`${topicsContext.routePath}/delete?topicId=${topicId}`);
      } else {
        toast.error('The requested topic does not exist.');
        debugger;
        router.replace(topicsContext.routePath);
      }
    },
    [router, topicsContext],
  );
  React.useEffect(() => {
    if (deleteTopicId) {
      openDeleteTopicModal(deleteTopicId);
    }
  }, [deleteTopicId, openDeleteTopicModal]);

  // Edit Topic Card
  const openEditTopicCard = React.useCallback(
    (topicId: TTopicId) => {
      const hasTopic = topicsContext.topics.find(({ id }) => id === topicId);
      if (hasTopic) {
        router.push(`${topicsContext.routePath}/${topicId}/edit`);
      } else {
        toast.error('The requested topic does not exist.');
        router.replace(topicsContext.routePath);
      }
    },
    [router, topicsContext],
  );
  React.useEffect(() => {
    if (editTopicId) {
      openEditTopicCard(editTopicId);
    }
  }, [editTopicId, openEditTopicCard]);

  // Edit Questions Page
  const openEditQuestionsPage = React.useCallback(
    (topicId: TTopicId) => {
      const hasTopic = topicsContext.topics.find(({ id }) => id === topicId);
      if (hasTopic) {
        router.push(`${topicsContext.routePath}/${topicId}/questions`);
      } else {
        toast.error('The requested topic does not exist.');
        router.replace(topicsContext.routePath);
      }
    },
    [router, topicsContext],
  );
  React.useEffect(() => {
    if (editTopicId) {
      openEditQuestionsPage(editTopicId);
    }
  }, [editTopicId, openEditQuestionsPage]);

  return (
    <ManageTopicsListWrapper
      openAddTopicModal={openAddTopicModal}
      openDeleteTopicModal={openDeleteTopicModal}
      openEditTopicCard={openEditTopicCard}
      openEditQuestionsPage={openEditQuestionsPage}
    />
  );
}
