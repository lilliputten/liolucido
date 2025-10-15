'use client';

import React from 'react';

import { TTopicId } from '@/features/topics/types';
import { useAvailableTopicsByScope } from '@/hooks';
import { useManageTopicsStore } from '@/stores/ManageTopicsStoreProvider';

import { ContentSkeleton } from './ContentSkeleton';
import { ManageTopicsListCard } from './ManageTopicsListCard';

interface TTopicsListProps {
  openAddTopicModal: () => void;
  openDeleteTopicModal: (topicId: TTopicId, from: string) => void;
  openEditTopicCard: (topicId: TTopicId) => void;
  openEditQuestionsPage: (topicId: TTopicId) => void;
}

export function ManageTopicsListWrapper(props: TTopicsListProps) {
  const { openAddTopicModal, openDeleteTopicModal, openEditTopicCard, openEditQuestionsPage } =
    props;

  const { manageScope } = useManageTopicsStore();

  const availableTopicsQuery = useAvailableTopicsByScope({ manageScope });
  const { isFetched } = availableTopicsQuery;

  if (!isFetched /* || isLoading */) {
    return <ContentSkeleton className="px-6 py-0" />;
  }

  return (
    <ManageTopicsListCard
      handleDeleteTopic={openDeleteTopicModal}
      handleEditTopic={openEditTopicCard}
      handleEditQuestions={openEditQuestionsPage}
      handleAddTopic={openAddTopicModal}
      availableTopicsQuery={availableTopicsQuery}
    />
  );
}
