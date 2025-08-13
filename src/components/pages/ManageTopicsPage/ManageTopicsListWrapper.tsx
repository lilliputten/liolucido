'use client';

import React from 'react';

import { rootRoute } from '@/config/routesConfig';
import { cn } from '@/lib/utils';
import { useGoBack } from '@/hooks/useGoBack';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/shared/icons';
import { isDev } from '@/constants';
import { useTopicsContext } from '@/contexts/TopicsContext/TopicsContext';
import { TTopicId } from '@/features/topics/types';

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
  const { topics } = useTopicsContext();

  const goBack = useGoBack(rootRoute);

  const hasTopics = !!topics.length;

  return (
    <div
      className={cn(
        isDev && '__ManageTopicsListWrapper', // DEBUG
        'relative flex flex-1 flex-col overflow-hidden',
      )}
    >
      {hasTopics ? (
        <ManageTopicsListCard
          className={cn(
            isDev && '__ManageTopicsListWrapper_Card', // DEBUG
            'relative flex flex-1 flex-col overflow-hidden',
          )}
          topics={topics}
          handleDeleteTopic={openDeleteTopicModal}
          handleEditTopic={openEditTopicCard}
          handleEditQuestions={openEditQuestionsPage}
          handleAddTopic={openAddTopicModal}
        />
      ) : (
        <PageEmpty
          className="size-full flex-1"
          // onButtonClick={openAddTopicModal}
          // buttonTitle="Add Topic"
          // iconName="topics"
          title="No topics have been created yet"
          description="You dont have any topics yet. Add any topic to your profile."
          buttons={
            <>
              <Button variant="ghost" onClick={goBack} className="flex gap-2">
                <Icons.ArrowLeft className="size-4" />
                Go Back
              </Button>
              <Button onClick={openAddTopicModal} className="flex gap-2">
                <Icons.topics className="size-4" />
                Add Topic
              </Button>
            </>
          }
        />
      )}
    </div>
  );
}
