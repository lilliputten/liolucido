'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { getErrorText } from '@/lib/helpers/strings';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { useTopicsContext } from '@/contexts/TopicsContext/TopicsContext';
import { deleteTopic } from '@/features/topics/actions/deleteTopic';
import { TTopic, TTopicId } from '@/features/topics/types';

import { deletedTopicEventId } from './constants';

interface TDeleteTopicModalProps {
  topicId?: TTopicId;
  from?: string;
}

export function DeleteTopicModal(props: TDeleteTopicModalProps) {
  const { topicId } = props;
  const router = useRouter();
  const topicsContext = useTopicsContext();
  const { topics } = topicsContext;

  const hideModal = React.useCallback(() => {
    const { href } = window.location;
    router.back();
    setTimeout(() => {
      // If still on the same page after trying to go back, fallback
      if (document.visibilityState === 'visible' && href === window.location.href) {
        router.push(topicsContext.routePath);
        // TODO: To use `from` parameter?
      }
    }, 200);
  }, [router, topicsContext]);

  if (!topicId) {
    throw new Error('No topic id passed for deletion');
  }
  const deletingTopic: TTopic | undefined = React.useMemo(
    () => topics.find(({ id }) => id === topicId),
    [topicId, topics],
  );
  const [isPending, startUpdating] = React.useTransition();

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
              topicsContext.setTopics((topics) =>
                topics.filter(({ id }) => id != deletingTopic.id),
              );
              resolve(deletingTopic);
              hideModal();
              // Dispatch a custom event with the selected language data
              const event = new CustomEvent<TTopic>(deletedTopicEventId, {
                detail: deletingTopic,
                bubbles: true,
              });
              window.dispatchEvent(event);
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
    [deletingTopic, hideModal, topicsContext],
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
      Are you confirming deleting the topic "{topicName}"?
    </ConfirmModal>
  );
}
