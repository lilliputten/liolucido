'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getErrorText } from '@/lib/helpers/strings';
import { cn } from '@/lib/utils';
import {
  addNewAvailableTopic,
  invalidateAllUsedKeysExcept,
  useAvailableTopicsByScope,
} from '@/hooks/useAvailableTopics';
import { useGoBack } from '@/hooks/useGoBack';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Modal } from '@/components/ui/modal';
import { isDev } from '@/constants';
import { useTopicsContext } from '@/contexts/TopicsContext/TopicsContext';
import { addNewTopic } from '@/features/topics/actions/addNewTopic';
import { TNewTopic, TTopic } from '@/features/topics/types';
import { useManageTopicsStore } from '@/stores/ManageTopicsStoreProvider';

import { AddTopicForm } from './AddTopicForm';

export function AddTopicModal() {
  const { manageScope } = useManageTopicsStore();
  const routePath = `/topics/${manageScope}`;
  const router = useRouter();
  const [isVisible, setVisible] = React.useState(false);
  const [isPending, startUpdating] = React.useTransition();
  const { isMobile } = useMediaQuery();

  const topicsContext = useTopicsContext();

  const availableTopics = useAvailableTopicsByScope({ manageScope });
  const queryClient = useQueryClient();
  const { queryKey } = availableTopics;

  // Check if we're still on the add route
  const pathname = usePathname();
  const isAddRoute = pathname?.endsWith('/add');

  const goBack = useGoBack(routePath);

  const hideModal = React.useCallback(() => {
    setVisible(false);
    goBack();
  }, [goBack]);

  // Check if the modal should be visible
  React.useEffect(() => {
    setVisible(isAddRoute);
    if (isAddRoute) {
      const originalTitle = document.title;
      document.title = 'Add a Topic';
      return () => {
        setVisible(false);
        document.title = originalTitle;
      };
    }
  }, [isAddRoute]);

  const handleAddTopic = React.useCallback(
    (newTopic: TNewTopic) => {
      return new Promise((resolve, reject) => {
        return startUpdating(() => {
          const promise = addNewTopic(newTopic)
            .then((addedTopic) => {
              // Update topics list
              topicsContext.setTopics((topics) => topics.concat(addedTopic));
              // Add the created item to the cached react-query data
              addNewAvailableTopic(queryClient, queryKey, addedTopic, true);
              // Invalidate all other keys...
              invalidateAllUsedKeysExcept(queryClient, queryKey);
              // Resolve added data
              resolve(addedTopic);
              // NOTE: Close the modal first
              setVisible(false);
              // Then navigate to the edit page after a short delay to ensure modal is closed
              setTimeout(() => {
                router.push(`${topicsContext.routePath}/${addedTopic.id}`);
              }, 100);
              return addedTopic;
            })
            .catch((error) => {
              // eslint-disable-next-line no-console
              console.error('[AddTopicModal:handleAddTopic:catch]', getErrorText(error), {
                error,
                newTopic,
              });
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
    [topicsContext, queryClient, queryKey, router],
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
          Add Topic Dialog
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
