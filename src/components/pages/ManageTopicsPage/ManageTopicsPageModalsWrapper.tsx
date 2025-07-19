'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { useTopicsContext } from '@/contexts/TopicsContext';
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
      if (!hasTopic) {
        toast.error('The requested topic does not exist.');
        router.replace(topicsContext.routePath);
      } else {
        router.push(`${topicsContext.routePath}/delete?id=${topicId}`);
      }
    },
    [router, topicsContext],
  );
  React.useEffect(() => {
    if (deleteTopicId) {
      openDeleteTopicModal(deleteTopicId);
    }
  }, [deleteTopicId, openDeleteTopicModal]);

  // Edit Topic Page
  const openEditTopicModal = React.useCallback(
    (topicId: TTopicId) => {
      const hasTopic = topicsContext.topics.find(({ id }) => id === topicId);
      if (!hasTopic) {
        toast.error('The requested topic does not exist.');
        router.replace(topicsContext.routePath);
      } else {
        router.push(`${topicsContext.routePath}/edit/${topicId}`);
      }
    },
    [router, topicsContext],
  );
  React.useEffect(() => {
    if (editTopicId) {
      openEditTopicModal(editTopicId);
    }
  }, [editTopicId, openEditTopicModal]);

  return (
    <ManageTopicsListWrapper
      openAddTopicModal={openAddTopicModal}
      openDeleteTopicModal={openDeleteTopicModal}
      openEditTopicModal={openEditTopicModal}
    />
  );
}
