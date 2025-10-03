'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';

import { getErrorText } from '@/lib/helpers/strings';
import { cn } from '@/lib/utils';
import { DialogDescription, DialogTitle } from '@/components/ui/Dialog';
import { Modal } from '@/components/ui/Modal';
import { isDev } from '@/constants';
import { addNewTopic } from '@/features/topics/actions/addNewTopic';
import { TNewTopic, TTopic } from '@/features/topics/types';
import {
  useAvailableTopicsByScope,
  useGoBack,
  useGoToTheRoute,
  useMediaQuery,
  useModalTitle,
  useUpdateModalVisibility,
} from '@/hooks';
import { useManageTopicsStore } from '@/stores/ManageTopicsStoreProvider';

import { AddTopicForm } from './AddTopicForm';

const urlPostfix = '/add';

export function AddTopicModal() {
  const { manageScope } = useManageTopicsStore();
  const routePath = `/topics/${manageScope}`;
  const [isVisible, setVisible] = React.useState(false);
  const [isPending, startUpdating] = React.useTransition();
  const { isMobile } = useMediaQuery();

  const availableTopicsQuery = useAvailableTopicsByScope({ manageScope });

  // Check if we're still on the add route
  const pathname = usePathname();
  /** Should the modal be visible? */
  const shouldBeVisible = pathname?.endsWith(urlPostfix);

  const goToTheRoute = useGoToTheRoute();
  const goBack = useGoBack(routePath);

  const hideModal = React.useCallback(() => {
    setVisible(false);
    goBack();
  }, [goBack]);

  useModalTitle('Add a Topic', shouldBeVisible);
  useUpdateModalVisibility(setVisible, shouldBeVisible);

  const handleAddTopic = React.useCallback(
    (newTopic: TNewTopic) => {
      return new Promise((resolve, reject) => {
        return startUpdating(() => {
          const promise = addNewTopic(newTopic)
            .then((addedTopic) => {
              // Add the created item to the cached react-query data
              availableTopicsQuery.addNewTopic(addedTopic, true);
              // Invalidate all other keys...
              availableTopicsQuery.invalidateAllKeysExcept([availableTopicsQuery.queryKey]);
              // Resolve added data
              resolve(addedTopic);
              // Close the modal first
              setVisible(false);
              // Then navigate to the edit page after a short delay to ensure modal is closed
              setTimeout(() => goToTheRoute(`${routePath}/${addedTopic.id}`, true), 100);
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
    [availableTopicsQuery, routePath, goToTheRoute],
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
