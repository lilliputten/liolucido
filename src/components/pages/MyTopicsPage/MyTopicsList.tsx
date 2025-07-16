'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { myTopicsRoute } from '@/config/routesConfig';
import { cn } from '@/lib/utils';
import { WaitingWrapper } from '@/components/ui/WaitingWrapper';
import { isDev } from '@/constants';
import { useTopicsContext } from '@/contexts/TopicsContext';
import { TTopicId } from '@/features/topics/types';

import { ContentSkeleton } from './ContentSkeleton';
import { MyTopicsListTable } from './MyTopicsListTable';
import { PageEmpty } from './PageEmpty';

interface TTopicsListProps {
  showAddModal?: boolean;
  deleteTopicId?: TTopicId;
}

interface TMemo {
  isUpdating?: boolean;
}

export function MyTopicsList(props: TTopicsListProps) {
  const router = useRouter();
  const { showAddModal, deleteTopicId } = props;
  const { topics } = useTopicsContext();

  const openDeleteTopicModal = React.useCallback(
    (topicId: TTopicId) => {
      router.push(`${myTopicsRoute}/delete?id=${topicId}`);
    },
    [router],
  );

  const openAddTopicModal = React.useCallback(() => router.push(myTopicsRoute + '/add'), [router]);

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

  const [isUpdating, _startUpdating] = React.useTransition(); // ???

  const memo = React.useMemo<TMemo>(() => ({}), []);

  // Effect: Update memo data
  React.useEffect(() => {
    memo.isUpdating = isUpdating;
  }, [memo, isUpdating]);

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
            // handleAddTopic={() => toggleAddTopicModal(true)}
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
      <WaitingWrapper show={isUpdating}>
        <ContentSkeleton />
      </WaitingWrapper>
    </div>
  );
}
