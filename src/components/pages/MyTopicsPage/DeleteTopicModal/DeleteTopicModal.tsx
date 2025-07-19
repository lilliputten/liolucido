'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { getErrorText } from '@/lib/helpers/strings';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Modal } from '@/components/ui/modal';
import { isDev } from '@/constants';
import { useTopicsContext } from '@/contexts/TopicsContext';
import { deleteTopic } from '@/features/topics/actions/deleteTopic';
import { TTopic, TTopicId } from '@/features/topics/types';

import { DeleteTopicForm } from './DeleteTopicForm';

interface TDeleteTopicModalProps {
  topicId?: TTopicId;
}

export function DeleteTopicModal(props: TDeleteTopicModalProps) {
  const { topicId } = props;
  const router = useRouter();
  const hideModal = React.useCallback(() => router.back(), [router]);
  const { topics, setTopics } = useTopicsContext();
  if (!topicId) {
    throw new Error('No topic id passed for deletion');
  }
  const deletingTopic: TTopic | undefined = React.useMemo(
    () => topics.find(({ id }) => id === topicId),
    [topicId, topics],
  );
  const [isPending, startUpdating] = React.useTransition();
  const { isMobile } = useMediaQuery();

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
          handleConfirm={confirmDeleteTopic}
          className="p-8"
          handleClose={hideModal}
          isPending={isPending}
        />
      </div>
    </Modal>
  );
}
