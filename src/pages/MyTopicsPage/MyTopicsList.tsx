'use client';

import React from 'react';
import { toast } from 'sonner';

import { getErrorText } from '@/lib/helpers/strings';
import { cn } from '@/lib/utils';
import { WaitingWrapper } from '@/components/ui/WaitingWrapper';
import { addNewTopic } from '@/features/topics/actions/addNewTopic';
import { TNewTopic, TTopic } from '@/features/topics/types';

import { AddTopicModal } from './AddTopicModal';
import { ContentSkeleton } from './ContentSkeleton';
import { PageEmpty } from './PageEmpty';

interface TTopicsListProps {
  initialTopics?: TTopic[];
}

export function MyTopicsList(props: TTopicsListProps) {
  const [showAddTopicModal, toggleAddTopicModal] = React.useState(false);
  const { initialTopics } = props;
  const [topics, setTopics] = React.useState(initialTopics || []);
  const [isUpdating, startUpdating] = React.useTransition();

  const memo = React.useMemo<{ isUpdating?: boolean }>(() => ({}), []);

  // Effect: Update memo data
  React.useEffect(() => {
    memo.isUpdating = isUpdating;
  }, [memo, isUpdating]);

  const hasTopics = !!topics.length;

  const handleAddTopic = React.useCallback((newTopic: TNewTopic) => {
    console.log('[MyTopicsList:handleAddTopic] start', {
      newTopic,
    });
    return new Promise((resolve, reject) => {
      return startUpdating(async () => {
        return addNewTopic(newTopic)
          .then((addedTopic) => {
            console.log('[MyTopicsList:done]', {
              addedTopic,
            });
            setTopics((topics) => {
              return topics.concat(addedTopic);
            });
            resolve(addedTopic);
          })
          .catch((error) => {
            // TODO: Probably there are no such user in the DB? To do logout and redirect then?
            const errText = 'Cannot create new topic';
            const description = getErrorText(error);
            // eslint-disable-next-line no-console
            console.error('[MyTopicsList:hand]', errText, description, {
              error,
              newTopic,
            });
            debugger; // eslint-disable-line no-debugger
            toast.error(errText, { description });
            reject(error);
          });
      });
    });
  }, []);

  /* // DEBUG: Show skeleton
   * const showSkeleton = true;
   * if (showSkeleton) {
   *   return <ContentSkeleton className={cn('__TopicsList_Skeleton')} />;
   * }
   */

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
          {topics.map(({ id, name }) => {
            return (
              <div key={id} data-id={id}>
                {name}
              </div>
            );
          })}
          {/*
          <TopicsListTable
            className={cn('__TopicsList_Table flex-1', tailwindClippingLayout({ vertical: true }))}
            topics={topics}
            // onDeleteTopic={onDeleteTopic}
            showAddTopicModal={showAddTopicModal}
          />
          */}
        </>
      ) : (
        <PageEmpty
          className="size-full flex-1"
          onButtonClick={() => toggleAddTopicModal(true)}
          buttonTitle="Add Topic"
          title="No topics have been created yet"
          description="You dont have any topics yet. Add any topic to your profile."
        />
      )}
      <WaitingWrapper show={isUpdating}>
        <ContentSkeleton />
      </WaitingWrapper>
      <AddTopicModal
        show={showAddTopicModal}
        toggle={toggleAddTopicModal}
        handleAddTopic={handleAddTopic}
      />
    </div>
  );
}
