'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { getErrorText } from '@/lib/helpers/strings';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { useTopicsContext } from '@/contexts/TopicsContext/TopicsContext';
import { deleteTopic } from '@/features/topics/actions/deleteTopic';
import { TTopic, TTopicId } from '@/features/topics/types';

interface TDeleteTopicModalProps {
  topicId?: TTopicId;
}

export function DeleteTopicModal(props: TDeleteTopicModalProps) {
  const { topicId } = props;
  const router = useRouter();
  const { topics, setTopics } = useTopicsContext();
  const hideModal = React.useCallback(() => router.back(), [router]);
  // const hideModal = React.useCallback(() => router.replace(routePath), [routePath, router]);
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
              setTopics((topics) => topics.filter(({ id }) => id != deletingTopic.id));
              resolve(deletingTopic);
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
    [deletingTopic, hideModal, setTopics],
  );

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
      Are you confirming deleting the topic "{deletingTopic?.name || 'Unknown topic'}"?
    </ConfirmModal>
  );
  /*
  return (
    <Modal
      isVisible
      hideModal={hideModal}
      className={cn(
        isDev && '__DeleteTopicModal', // DEBUG
        'gap-0',
        isPending && '[&>*]:pointer-events-none [&>*]:opacity-50',
      )}
    >
      <div
        className={cn(
          isDev && '__DeleteTopicModal_Header', // DEBUG
          !isMobile && 'max-h-[90vh]',
          'flex flex-col border-b bg-accent px-8 py-4',
        )}
      >
        <DialogTitle className="DialogTitle">Delete Topic?</DialogTitle>
        <DialogDescription aria-hidden="true" hidden>
          Delete topic dialog
        </DialogDescription>
      </div>
      <div className="flex flex-col px-8 py-4">
        <DeleteTopicForm
          name={deletingTopic?.name || ''}
          className="p-8"
          handleConfirm={confirmDeleteTopic}
          handleClose={hideModal}
          isPending={isPending}
        />
      </div>
    </Modal>
  );
  */
}
