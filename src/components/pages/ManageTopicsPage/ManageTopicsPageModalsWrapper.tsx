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
  from?: string;
}

export function ManageTopicsPageModalsWrapper(props: TTopicsListProps) {
  const router = useRouter();
  const { showAddModal, deleteTopicId, editTopicId, from } = props;
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
    (topicId: TTopicId, from: string) => {
      const hasTopic = topicsContext.topics.find(({ id }) => id === topicId);
      if (hasTopic) {
        router.push(`${topicsContext.routePath}/delete?topicId=${topicId}&from=${from}`);
      } else {
        toast.error('The requested topic does not exist.');
        router.replace(topicsContext.routePath);
      }
    },
    [router, topicsContext],
  );
  React.useEffect(() => {
    if (deleteTopicId) {
      if (from?.startsWith('SERVER:')) {
        // eslint-disable-next-line no-console
        console.warn('No url-invoked topics deletions allowed!');
        router.replace(topicsContext.routePath);
      } else {
        openDeleteTopicModal(deleteTopicId, from || 'Unknown_in_ManageTopicsPageModalsWrapper');
      }
    }
  }, [deleteTopicId, router, topicsContext, openDeleteTopicModal, from]);

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
