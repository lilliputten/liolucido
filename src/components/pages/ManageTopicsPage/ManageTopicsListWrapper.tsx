'use client';

import React from 'react';

import { rootRoute } from '@/config/routesConfig';
import { cn } from '@/lib/utils';
import { getUnqueTopicsList } from '@/hooks/helpers/availableTopics';
import { useAvailableTopicsByScope } from '@/hooks/useAvailableTopics';
import { useGoBack } from '@/hooks/useGoBack';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Icons } from '@/components/shared/icons';
import { PageError } from '@/components/shared/PageError';
import { isDev } from '@/constants';
import { useTopicsContext } from '@/contexts/TopicsContext/TopicsContext';
import { TTopicId } from '@/features/topics/types';
import { useManageTopicsStore } from '@/stores/ManageTopicsStoreProvider';

import { PageEmpty } from '../shared';
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
  // TODO: Remove when done migrating to useAvailableTopicsByScope (temporarily feeding topics context from `AvailableTopics`)
  const { topics, setTopics } = useTopicsContext();

  const goBack = useGoBack(rootRoute);

  const manageTopicsStore = useManageTopicsStore();
  const { manageScope } = manageTopicsStore;

  const availableTopics = useAvailableTopicsByScope({ manageScope });
  const {
    data,
    isLoading,
    // isFetched,
    refetch,
    isError,
    error,
    hasTopics,
  } = availableTopics;

  // TODO: Remove when done migrating to useAvailableTopicsByScope
  React.useEffect(() => {
    const allTopics = getUnqueTopicsList(data?.pages);
    setTopics(allTopics);
  }, [data, setTopics]);

  if (isError) {
    return (
      <PageError
        className={cn(
          isDev && '__ManageTopicsListWrapper_Error', // DEBUG
        )}
        error={error || 'Error loading available topics data'}
        reset={refetch}
        // extraActions={extraActions}
      />
    );
  }

  if (isLoading) {
    return (
      <Card className={cn('xl:col-span-2', 'relative flex flex-1 flex-col overflow-hidden')}>
        <CardContent className={cn('relative flex flex-1 flex-col overflow-hidden p-4')}>
          <ContentSkeleton />
        </CardContent>
      </Card>
    );
  }

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
