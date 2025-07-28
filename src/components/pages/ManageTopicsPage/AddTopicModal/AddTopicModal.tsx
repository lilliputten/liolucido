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
import { useTopicsContext } from '@/contexts/TopicsContext/TopicsContext';
import { addNewTopic } from '@/features/topics/actions/addNewTopic';
import { TNewTopic, TTopic } from '@/features/topics/types';

import { AddTopicForm } from './AddTopicForm';

export function AddTopicModal() {
  const [isVisible, setVisible] = React.useState(true);
  const router = useRouter();
  const hideModal = React.useCallback(() => {
    setVisible(false);
    router.back();
    // TODO: Add no-history failback
  }, [router]);
  const [isPending, startUpdating] = React.useTransition();
  const { isMobile } = useMediaQuery();

  const topicsContext = useTopicsContext();

  // Change a browser title
  React.useEffect(() => {
    const originalTitle = document.title;
    document.title = 'Add a Topic';
    return () => {
      document.title = originalTitle;
    };
  }, []);

  const handleAddTopic = React.useCallback(
    (newTopic: TNewTopic) => {
      return new Promise((resolve, reject) => {
        return startUpdating(() => {
          const promise = addNewTopic(newTopic)
            .then((addedTopic) => {
              // Update topics list
              topicsContext.setTopics((topics) => topics.concat(addedTopic));
              resolve(addedTopic);
              // NOTE: Close or go to the edit page
              setVisible(false);
              router.replace(`${topicsContext.routePath}/${addedTopic.id}/edit`);
              return addedTopic;
            })
            .catch((error) => {
              // eslint-disable-next-line no-console
              console.error('[AddTopicModal:handleAddTopic:catch]', getErrorText(error), {
                error,
                newTopic,
              });
              debugger; // eslint-disable-line no-debugger
              reject(error);
              throw error;
            });
          toast.promise<TTopic>(promise, {
            loading: 'Creating new topic...',
            success: (topic) => `Successfully created new topic "${topic.name}"`,
            error: 'Can not create new topic',
          });
        });
      });
    },
    [topicsContext, router],
  );

  return (
    <Modal
      isVisible={isVisible}
      hideModal={hideModal}
      className={cn(
        isDev && '__AddTopicModal', // DEBUG
        'gap-0',
        isPending && '[&>*]:pointer-events-none [&>*]:opacity-50',
      )}
    >
      <div
        className={cn(
          isDev && '__AddTopicModal_Header', // DEBUG
          !isMobile && 'max-h-[90vh]',
          'flex flex-col border-b bg-accent px-8 py-4',
        )}
      >
        <DialogTitle className="DialogTitle">Add Topic</DialogTitle>
        <DialogDescription aria-hidden="true" hidden>
          Add topic dialog
        </DialogDescription>
      </div>
      <div className="flex flex-col px-8 py-4">
        <AddTopicForm
          handleAddTopic={handleAddTopic}
          className="p-8"
          handleClose={hideModal}
          isPending={isPending}
        />
      </div>
    </Modal>
  );
}
