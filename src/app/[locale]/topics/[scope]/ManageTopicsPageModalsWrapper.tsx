'use client';

import React from 'react';
import { toast } from 'sonner';

import { TAvailableTopic, TTopicId } from '@/features/topics/types';
import { useAvailableTopicsByScope, useGoToTheRoute } from '@/hooks';
import { useManageTopicsStore } from '@/stores/ManageTopicsStoreProvider';

import { ManageTopicsListWrapper } from './ManageTopicsListWrapper';

interface TTopicsListProps {
  showAddModal?: boolean;
  deleteTopicId?: TTopicId;
  editTopicId?: TTopicId;
  editQuestionsTopicId?: TTopicId;
  from?: string;
}

interface TMemo {
  allTopics?: TAvailableTopic[];
  routePath?: string;
  // isFetched?: boolean;
}

export function ManageTopicsPageModalsWrapper(props: TTopicsListProps) {
  const memo = React.useMemo<TMemo>(() => ({}), []);
  const { showAddModal, deleteTopicId, editTopicId, editQuestionsTopicId, from } = props;
  const { manageScope } = useManageTopicsStore();
  const routePath = `/topics/${manageScope}`;
  const availableTopics = useAvailableTopicsByScope({ manageScope });
  const { allTopics, isFetched } = availableTopics;
  // memo.isFetched = isFetched;
  memo.routePath = routePath;
  memo.allTopics = allTopics;

  const goToTheRoute = useGoToTheRoute();

  // Add Topic Modal
  const openAddTopicModal = React.useCallback(() => {
    const { routePath } = memo;
    if (routePath) {
      const url = `${routePath}/add`;
      goToTheRoute(url);
    }
  }, [memo, goToTheRoute]);
  React.useEffect(() => {
    if (showAddModal) {
      openAddTopicModal();
    }
  }, [showAddModal, openAddTopicModal]);

  // Delete Topic Modal
  const openDeleteTopicModal = React.useCallback(
    (topicId: TTopicId, from: string) => {
      const { allTopics, routePath } = memo;
      if (allTopics && routePath) {
        const hasTopic = allTopics.find(({ id }) => id === topicId);
        if (hasTopic) {
          const url = `${routePath}/delete?topicId=${topicId}&from=${from}`;
          goToTheRoute(url);
        } else {
          toast.error('The requested topic does not exist.');
          goToTheRoute(routePath, true);
        }
      }
    },
    [memo, goToTheRoute],
  );
  React.useEffect(() => {
    if (deleteTopicId && isFetched) {
      /* // UNUSED: Prevent opening the delete topic midal with a browser url (but not with a programmatic router redirect)
       * if (from?.startsWith('SERVER:')) {
       *   // eslint-disable-next-line no-console
       *   console.warn('No url-invoked topic deletions allowed!');
       *   router.replace(routePath);
       * } else {
       */
      openDeleteTopicModal(deleteTopicId, from || 'Unknown_in_ManageTopicsPageModalsWrapper');
    }
  }, [deleteTopicId, openDeleteTopicModal, from, isFetched]);

  // Edit Topic Card
  const openEditTopicCard = React.useCallback(
    (topicId: TTopicId) => {
      const { allTopics, routePath } = memo;
      if (allTopics && routePath) {
        const hasTopic = allTopics.find(({ id }) => id === topicId);
        if (hasTopic) {
          const url = `${routePath}/${topicId}/edit`;
          goToTheRoute(url);
        } else {
          toast.error('The requested topic does not exist.');
          goToTheRoute(routePath, true);
        }
      }
    },
    [memo, goToTheRoute],
  );
  React.useEffect(() => {
    if (editTopicId && isFetched) {
      openEditTopicCard(editTopicId);
    }
  }, [editTopicId, openEditTopicCard, isFetched]);

  // Edit Questions Page
  const openEditQuestionsPage = React.useCallback(
    (topicId: TTopicId) => {
      const { allTopics, routePath } = memo;
      if (allTopics && routePath) {
        const hasTopic = allTopics.find(({ id }) => id === topicId);
        if (hasTopic) {
          const url = `${routePath}/${topicId}/questions`;
          goToTheRoute(url);
        } else {
          toast.error('The requested topic does not exist.');
          goToTheRoute(routePath, true);
        }
      }
    },
    [memo, goToTheRoute],
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
