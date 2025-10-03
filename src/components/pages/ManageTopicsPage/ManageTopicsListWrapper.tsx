'use client';

import React from 'react';

import { rootRoute } from '@/config/routesConfig';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import * as Icons from '@/components/shared/Icons';
import { PageError } from '@/components/shared/PageError';
import { isDev } from '@/constants';
import { TTopicId } from '@/features/topics/types';
import { useAvailableTopicsByScope, useGoBack } from '@/hooks';
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

  const goBack = useGoBack(rootRoute);

  const manageTopicsStore = useManageTopicsStore();
  const { manageScope } = manageTopicsStore;

  const availableTopics = useAvailableTopicsByScope({ manageScope });
  const {
    // data,
    isLoading,
    isFetched,
    refetch,
    isError,
    error,
    hasTopics,
  } = availableTopics;

  if (!isFetched || isLoading) {
    return (
      <Card className={cn('xl:col-span-2', 'relative flex flex-1 flex-col overflow-hidden')}>
        <CardContent className={cn('relative flex flex-1 flex-col overflow-hidden p-4')}>
          <ContentSkeleton />
        </CardContent>
      </Card>
    );
  }

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

  if (!hasTopics) {
    return (
      <PageEmpty
        className="size-full flex-1"
        // onButtonClick={openAddTopicModal}
        // buttonTitle="Add Topic"
        icon={Icons.Topics}
        title="No topics have been created yet"
        description="You dont have any topics yet. Add any topic to your profile."
        buttons={
          <>
            <Button variant="ghost" onClick={goBack} className="flex gap-2">
              <Icons.ArrowLeft className="hidden size-4 opacity-50 sm:flex" />
              Go Back
            </Button>
            <Button onClick={openAddTopicModal} className="flex gap-2">
              <Icons.Topics className="hidden size-4 opacity-50 sm:flex" />
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
