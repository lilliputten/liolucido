'use client';

import React from 'react';

import { cn } from '@/lib/utils';
import { isDev } from '@/constants';
import { useTopicsContext } from '@/contexts/TopicsContext';
import { TTopicId } from '@/features/topics/types';

import { MyTopicsListTable } from './MyTopicsListTable';
import { PageEmpty } from './PageEmpty';

interface TTopicsListProps {
  openDeleteTopicModal: (topicId: TTopicId) => void;
  openAddTopicModal: () => void;
}

export function MyTopicsList(props: TTopicsListProps) {
  const { openDeleteTopicModal, openAddTopicModal } = props;
  const { topics } = useTopicsContext();

  const hasTopics = !!topics.length;

  return (
    <div
      className={cn(
        '__TopicsList',
        'relative',
        'transition-opacity',
        'flex-1',
        // tailwindClippingLayout({ vertical: true }),
      )}
    >
      {hasTopics ? (
        <>
          <MyTopicsListTable
            className={cn(
              isDev && '__MyTopicsList_Table', // DEBUG
              'flex-1',
              // tailwindClippingLayout({ vertical: true }),
            )}
            topics={topics}
            handleDeleteTopic={openDeleteTopicModal}
            handleAddTopic={openAddTopicModal}
          />
        </>
      ) : (
        <PageEmpty
          className="size-full flex-1"
          onButtonClick={openAddTopicModal}
          buttonTitle="Add Topic"
          title="No topics have been created yet"
          description="You dont have any topics yet. Add any topic to your profile."
        />
      )}
      {/*
      <WaitingWrapper show={isUpdating}>
        <ContentSkeleton />
      </WaitingWrapper>
      */}
    </div>
  );
}
