'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { myTopicsRoute } from '@/config/routesConfig';
import { useTopicsContext } from '@/contexts/TopicsContext';
import { TTopicId } from '@/features/topics/types';

import { MyTopicsList } from './MyTopicsList';

interface TTopicsListProps {
  showAddModal?: boolean;
  deleteTopicId?: TTopicId;
}

export function MyTopicsPageModalsWrapper(props: TTopicsListProps) {
  const router = useRouter();
  const { showAddModal, deleteTopicId } = props;
  const { topics } = useTopicsContext();

  const openDeleteTopicModal = React.useCallback(
    (topicId: TTopicId) => {
      const hasTopic = topics.find(({ id }) => id === topicId);
      if (!hasTopic) {
        toast.error('The requested topic does not exist.');
      } else {
        router.push(`${myTopicsRoute}/delete?id=${topicId}`);
      }
    },
    [router, topics],
  );

  const openAddTopicModal = React.useCallback(() => {
    router.push(myTopicsRoute + '/add');
  }, [router]);

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

  return (
    <MyTopicsList
      openAddTopicModal={openAddTopicModal}
      openDeleteTopicModal={openDeleteTopicModal}
    />
  );
}
