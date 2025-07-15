'use client';

import React from 'react';
import { toast } from 'sonner';

import { getErrorText } from '@/lib/helpers/strings';
import { cn } from '@/lib/utils';
import { WaitingWrapper } from '@/components/ui/WaitingWrapper';
import { isDev } from '@/constants';
import { addNewTopic } from '@/features/topics/actions/addNewTopic';
import { deleteTopic } from '@/features/topics/actions/deleteTopic';
import { TNewTopic, TTopic } from '@/features/topics/types';

import { AddTopicModal } from './AddTopicModal';
import { ConfirmDeleteTopicModal } from './ConfirmDeleteTopicModal';
import { ContentSkeleton } from './ContentSkeleton';
import { MyTopicsListTable } from './MyTopicsListTable';
import { PageEmpty } from './PageEmpty';

interface TTopicsListProps {
  initialTopics?: TTopic[];
}

interface TMemo {
  isUpdating?: boolean;
}

export function MyTopicsList(props: TTopicsListProps) {
  const [showAddTopicModal, toggleAddTopicModal] = React.useState(false);
  const [deletingTopic, setDeletingTopic] = React.useState<TTopic | undefined>();
  const { initialTopics } = props;
  const [topics, setTopics] = React.useState(initialTopics || []);
  const [isUpdating, startUpdating] = React.useTransition();

  const memo = React.useMemo<TMemo>(() => ({}), []);

  React.useEffect(() => {
    toast.info('Sample toast');
  }, []);

  // Effect: Update memo data
  React.useEffect(() => {
    memo.isUpdating = isUpdating;
  }, [memo, isUpdating]);

  const handleAddTopic = React.useCallback(
    (newTopic: TNewTopic) =>
      new Promise((resolve, reject) => {
        return startUpdating(() => {
          const promise = addNewTopic(newTopic)
            .then((addedTopic) => {
              setTopics((topics) => topics.concat(addedTopic));
              resolve(addedTopic);
              return addedTopic;
            })
            .catch((error) => {
              // eslint-disable-next-line no-console
              console.error('[MyTopicsList:handleAddTopic:catch]', getErrorText(error), {
                error,
                newTopic,
              });
              debugger; // eslint-disable-line no-debugger
              reject(error);
              throw error;
            });
          toast.promise<TTopic>(promise, {
            loading: `Creating new topic...`,
            success: (topic) => `Successfully created new topic "${topic.name}"`,
            error: `Can not create new topic`,
          });
        });
      }),
    [],
  );

  const confirmDeleteTopic = React.useCallback(
    () =>
      new Promise((resolve, reject) => {
        if (!deletingTopic) {
          const error = new Error('No topic topic to delete has been specified');
          reject(error);
          return;
        }
        const { name } = deletingTopic;
        return startUpdating(() => {
          const promise = deleteTopic(deletingTopic)
            .then(() => {
              setTopics((topics) => topics.filter(({ id }) => id != deletingTopic.id));
              resolve(deletingTopic);
              setDeletingTopic(undefined);
            })
            .catch((error) => {
              // eslint-disable-next-line no-console
              console.error('[MyTopicsList:confirmDeleteTopic:catch]', getErrorText(error), {
                error,
              });
              debugger; // eslint-disable-line no-debugger
              reject(error);
              throw error;
            });
          toast.promise(promise, {
            loading: `Deleting topic "${name}"`,
            success: `Successfully deleted opic "${name}"`,
            error: `Can not delete topic "${name}"`,
          });
        });
      }),
    [deletingTopic],
  );

  /* // DEBUG: Show skeleton
   * const showSkeleton = true;
   * if (showSkeleton) {
   *   return <ContentSkeleton className={cn('__TopicsList_Skeleton')} />;
   * }
   */

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
            handleDeleteTopic={setDeletingTopic}
            handleAddTopic={() => toggleAddTopicModal(true)}
          />
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
        isVisible={showAddTopicModal}
        hideModal={() => toggleAddTopicModal(false)}
        handleAddTopic={handleAddTopic}
      />
      <ConfirmDeleteTopicModal
        deletingTopic={deletingTopic}
        hideModal={() => setDeletingTopic(undefined)}
        handleConfirm={confirmDeleteTopic}
      />
    </div>
  );
}
