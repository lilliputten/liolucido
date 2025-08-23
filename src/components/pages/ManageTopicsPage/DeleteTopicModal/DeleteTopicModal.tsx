'use client';

import React from 'react';
import { toast } from 'sonner';

import { getErrorText } from '@/lib/helpers/strings';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { deleteTopic } from '@/features/topics/actions/deleteTopic';
import { TTopic, TTopicId } from '@/features/topics/types';
import { useAvailableTopicsByScope, useGoBack, useModalTitle } from '@/hooks';
import { useManageTopicsStore } from '@/stores/ManageTopicsStoreProvider';

interface TDeleteTopicModalProps {
  topicId?: TTopicId;
  from?: string;
}

export function DeleteTopicModal(props: TDeleteTopicModalProps) {
  const { manageScope } = useManageTopicsStore();
  const routePath = `/topics/${manageScope}`;
  const { topicId } = props;

  const availableTopics = useAvailableTopicsByScope({ manageScope });

  const goBack = useGoBack(routePath);

  const hideModal = React.useCallback(() => {
    // setVisible(false);
    goBack();
  }, [goBack]);

  if (!topicId) {
    throw new Error('No topic id passed for deletion');
  }
  const deletingTopic: TTopic | undefined = React.useMemo(
    () => availableTopics.allTopics.find(({ id }) => id === topicId),
    [topicId, availableTopics.allTopics],
  );
  const [isPending, startUpdating] = React.useTransition();

  useModalTitle('Delete a Topic?');

  const confirmDeleteTopic = React.useCallback(
    () =>
      new Promise((resolve, reject) => {
        const name = deletingTopic?.name;
        return startUpdating(() => {
          if (!deletingTopic) {
            reject(new Error('No topic to delete provided'));
            return;
          }
          const promise = deleteTopic(deletingTopic)
            .then(() => {
              // Delete the topic from the cached react-query data
              availableTopics.deleteTopic(deletingTopic.id);
              // Invalidate all other keys...
              availableTopics.invalidateAllKeysExcept([availableTopics.queryKey]);
              /* // UNUSED: Delete the topic from the topics context and roadcast the event (?)
               * topicsContext.setTopics((topics) => {
               *   const updatedTopics = topics.filter(({ id }) => id != deletingTopic.id);
               *   // Dispatch a custom event with the deleted topic info
               *   const detail: TDeletedTopicDetail = {
               *     deletedTopicId: deletingTopic.id,
               *     topicsCount: updatedTopics.length,
               *   };
               *   const event = new CustomEvent<TDeletedTopicDetail>(deletedTopicEventName, {
               *     detail,
               *     bubbles: true,
               *   });
               *   setTimeout(() => window.dispatchEvent(event), 100);
               *   // Return updated data
               *   return updatedTopics;
               * });
               */
              // Resolve added data
              resolve(deletingTopic);
              // Hide modal (go back)
              hideModal();
            })
            .catch((error) => {
              // eslint-disable-next-line no-console
              console.error('[DeleteTopicModal:confirmDeleteTopic:catch]', getErrorText(error), {
                error,
              });
              debugger; // eslint-disable-line no-debugger
              reject(error);
              throw error;
            });
          toast.promise(promise, {
            loading: `Deleting topic "${name}"`,
            success: `Successfully deleted topic "${name}"`,
            error: `Can not delete topic "${name}"`,
          });
        });
      }),
    [availableTopics, deletingTopic, hideModal],
  );

  const topicName = deletingTopic?.name;

  if (!topicName) {
    return null;
  }

  return (
    <ConfirmModal
      dialogTitle="Confirm delete topic"
      confirmButtonVariant="destructive"
      confirmButtonText="Delete"
      confirmButtonBusyText="Deleting"
      cancelButtonText="Cancel"
      handleConfirm={confirmDeleteTopic}
      handleClose={hideModal}
      isPending={isPending}
      isVisible
    >
      Do you confirm deleting the topic "{topicName}"?
    </ConfirmModal>
  );
}
