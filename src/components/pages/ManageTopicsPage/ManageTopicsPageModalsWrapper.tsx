'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { useAvailableTopicsByScope } from '@/hooks/useAvailableTopics';
import { TTopicId } from '@/features/topics/types';
import { useManageTopicsStore } from '@/stores/ManageTopicsStoreProvider';

import { ManageTopicsListWrapper } from './ManageTopicsListWrapper';

interface TTopicsListProps {
  showAddModal?: boolean;
  deleteTopicId?: TTopicId;
  editTopicId?: TTopicId;
  editQuestionsTopicId?: TTopicId;
  from?: string;
}

export function ManageTopicsPageModalsWrapper(props: TTopicsListProps) {
  const router = useRouter();
  const { showAddModal, deleteTopicId, editTopicId, editQuestionsTopicId, from } = props;
  const { manageScope } = useManageTopicsStore();
  const routePath = `/topics/${manageScope}`;
  const availableTopics = useAvailableTopicsByScope({ manageScope });
  const { allTopics } = availableTopics;

  // Add Topic Modal
  const openAddTopicModal = React.useCallback(() => {
    router.push(routePath + '/add');
  }, [router, routePath]);
  React.useEffect(() => {
    if (showAddModal) {
      openAddTopicModal();
    }
  }, [showAddModal, openAddTopicModal]);

  // Delete Topic Modal
  const openDeleteTopicModal = React.useCallback(
    (topicId: TTopicId, from: string) => {
      const hasTopic = allTopics.find(({ id }) => id === topicId);
      if (hasTopic) {
        router.push(`${routePath}/delete?topicId=${topicId}&from=${from}`);
      } else {
        toast.error('The requested topic does not exist.');
        router.replace(routePath);
      }
    },
    [router, routePath, allTopics],
  );
  React.useEffect(() => {
    if (deleteTopicId) {
      if (from?.startsWith('SERVER:')) {
        // eslint-disable-next-line no-console
        console.warn('No url-invoked topic deletions allowed!');
        router.replace(routePath);
      } else {
        openDeleteTopicModal(deleteTopicId, from || 'Unknown_in_ManageTopicsPageModalsWrapper');
      }
    }
  }, [deleteTopicId, router, routePath, openDeleteTopicModal, from]);

  // Edit Topic Card
  const openEditTopicCard = React.useCallback(
    (topicId: TTopicId) => {
      const hasTopic = allTopics.find(({ id }) => id === topicId);
      if (hasTopic) {
        router.push(`${routePath}/${topicId}/edit`);
      } else {
        toast.error('The requested topic does not exist.');
        router.replace(routePath);
      }
    },
    [router, routePath, allTopics],
  );
  React.useEffect(() => {
    if (editTopicId) {
      openEditTopicCard(editTopicId);
    }
  }, [editTopicId, openEditTopicCard]);

  // Edit Questions Page
  const openEditQuestionsPage = React.useCallback(
    (topicId: TTopicId) => {
      const hasTopic = allTopics.find(({ id }) => id === topicId);
      if (hasTopic) {
        router.push(`${routePath}/${topicId}/questions`);
      } else {
        toast.error('The requested topic does not exist.');
        router.replace(routePath);
      }
    },
    [router, routePath, allTopics],
  );
  React.useEffect(() => {
    // Use another id (`editQuestionsTopicId`)?
    if (editQuestionsTopicId) {
      openEditQuestionsPage(editQuestionsTopicId);
    }
  }, [editQuestionsTopicId, openEditQuestionsPage]);

  return (
    <ManageTopicsListWrapper
      openAddTopicModal={openAddTopicModal}
      openDeleteTopicModal={openDeleteTopicModal}
      openEditTopicCard={openEditTopicCard}
      openEditQuestionsPage={openEditQuestionsPage}
    />
  );
}
