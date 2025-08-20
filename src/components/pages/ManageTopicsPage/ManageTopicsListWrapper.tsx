'use client';

import React from 'react';

import { rootRoute } from '@/config/routesConfig';
import { cn } from '@/lib/utils';
import { getUnqueTopicsList, useAvailableTopics } from '@/hooks/useAvailableTopics';
import { useGoBack } from '@/hooks/useGoBack';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/shared/icons';
import { isDev } from '@/constants';
import { useTopicsContext } from '@/contexts/TopicsContext/TopicsContext';
import { TTopicId } from '@/features/topics/types';
import { useManageTopicsStore } from '@/stores/ManageTopicsStoreProvider';

import { PageEmpty } from '../shared';
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
  // TODO: Remove
  const { topics, setTopics } = useTopicsContext();

  const goBack = useGoBack(rootRoute);

  const manageTopicsStore = useManageTopicsStore();

  const availableTopics = useAvailableTopics();
  const { data, isLoading, isError, hasTopics } = availableTopics;

  // TODO: Remove
  React.useEffect(() => {
    const allTopics = getUnqueTopicsList(data?.pages);
    setTopics(allTopics);
  }, [data, setTopics]);

  // const hasTopics = !!topics.length;

  if (!hasTopics) {
    return (
      <PageEmpty
        className="size-full flex-1"
        // onButtonClick={openAddTopicModal}
        // buttonTitle="Add Topic"
        iconName="topics"
        title="No topics have been created yet"
        description="You dont have any topics yet. Add any topic to your profile."
        buttons={
          <>
            <Button variant="ghost" onClick={goBack} className="flex gap-2">
              <Icons.ArrowLeft className="hidden size-4 opacity-50 sm:flex" />
              Go Back
            </Button>
            <Button onClick={openAddTopicModal} className="flex gap-2">
              <Icons.topics className="hidden size-4 opacity-50 sm:flex" />
              Add Topic
            </Button>
          </>
        }
      />
    );
  }

  return (
    <ManageTopicsListCard
      className={cn(
        isDev && '__ManageTopicsListWrapper_Card', // DEBUG
        'relative flex flex-1 flex-col overflow-hidden',
      )}
      // topics={topics}
      handleDeleteTopic={openDeleteTopicModal}
      handleEditTopic={openEditTopicCard}
      handleEditQuestions={openEditQuestionsPage}
      handleAddTopic={openAddTopicModal}
    />
  );
}
