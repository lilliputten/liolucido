'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { myTopicsRoute } from '@/config/routesConfig';
import { useTopicsContext } from '@/contexts/TopicsContext';
import { TTopicId } from '@/features/topics/types';

import { MyTopicsListWrapper } from './MyTopicsListWrapper';

interface TTopicsListProps {
  showAddModal?: boolean;
  deleteTopicId?: TTopicId;
  editTopicId?: TTopicId;
}

export function MyTopicsPageModalsWrapper(props: TTopicsListProps) {
  const router = useRouter();
  const { showAddModal, deleteTopicId, editTopicId } = props;
  const { topics } = useTopicsContext();

  const openAddTopicModal = React.useCallback(() => {
    router.push(myTopicsRoute + '/add');
  }, [router]);

  const openDeleteTopicModal = React.useCallback(
    (topicId: TTopicId) => {
      const hasTopic = topics.find(({ id }) => id === topicId);
      if (!hasTopic) {
        toast.error('The requested topic does not exist.');
        router.replace(myTopicsRoute);
      } else {
        router.push(`${myTopicsRoute}/delete?id=${topicId}`);
      }
    },
    [router, topics],
  );

  const openEditTopicModal = React.useCallback(
    (topicId: TTopicId) => {
      const hasTopic = topics.find(({ id }) => id === topicId);
      if (!hasTopic) {
        toast.error('The requested topic does not exist.');
        router.replace(myTopicsRoute);
      } else {
        router.push(`${myTopicsRoute}/edit?id=${topicId}`);
      }
    },
    [router, topics],
  );

  React.useEffect(() => {
    if (showAddModal) {
      openAddTopicModal();
    }
  }, [showAddModal, openAddTopicModal]);

  React.useEffect(() => {
    if (deleteTopicId) {
      openDeleteTopicModal(deleteTopicId);
    }
  }, [deleteTopicId, openDeleteTopicModal]);

  React.useEffect(() => {
    if (editTopicId) {
      openEditTopicModal(editTopicId);
    }
  }, [editTopicId, openEditTopicModal]);

  return (
    <MyTopicsListWrapper
      openAddTopicModal={openAddTopicModal}
      openDeleteTopicModal={openDeleteTopicModal}
      openEditTopicModal={openEditTopicModal}
    />
  );
}
