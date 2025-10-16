'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { APIError } from '@/lib/types/api';
import { cn } from '@/lib/utils';
import { DialogDescription, DialogTitle } from '@/components/ui/Dialog';
import { Modal } from '@/components/ui/Modal';
import { isDev } from '@/constants';
import { useSettings } from '@/contexts/SettingsContext';
import { addNewTopic } from '@/features/topics/actions/addNewTopic';
import { TAvailableTopic, TNewTopic } from '@/features/topics/types';
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
  const { isMobile } = useMediaQuery();

  const { jumpToNewEntities } = useSettings();

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

  const addTopicMutation = useMutation<TAvailableTopic, Error, TNewTopic>({
    mutationFn: addNewTopic,
    onSuccess: (addedTopic) => {
      // Add the created item to the cached react-query data
      availableTopicsQuery.addNewTopic(addedTopic, true);
      // Invalidate all other keys...
      availableTopicsQuery.invalidateAllKeysExcept([availableTopicsQuery.queryKey]);
      // Close the modal first
      setVisible(false);
      if (jumpToNewEntities) {
        // Then navigate to the edit page after a short delay to ensure modal is closed
        // setTimeout(() => goToTheRoute(`${routePath}/${addedTopic.id}`, true), 100);
        goToTheRoute(`${routePath}/${addedTopic.id}`, true);
      }
    },
    onError: (error, newTopic) => {
      const details = error instanceof APIError ? error.details : null;
      const message = 'Cannot create topic';
      // eslint-disable-next-line no-console
      console.error('[AddTopicModal:addTopicMutation]', message, {
        error,
        details,
        newTopic,
      });
      debugger; // eslint-disable-line no-debugger
    },
  });

  const handleAddTopic = React.useCallback(
    (newTopic: TNewTopic) => {
      const promise = addTopicMutation.mutateAsync(newTopic);
      toast.promise(promise, {
        loading: 'Creating new topic...',
        success: (topic) => `Successfully created new topic "${topic.name}"`,
        error: 'Can not create new topic',
      });
      return promise;
    },
    [addTopicMutation],
  );

  if (!shouldBeVisible) {
    return null;
  }

  return (
    <Modal
      isVisible={isVisible}
      hideModal={hideModal}
      className={cn(
        isDev && '__AddTopicModal', // DEBUG
        'gap-0',
        addTopicMutation.isPending && '[&>*]:pointer-events-none [&>*]:opacity-50',
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
          isPending={addTopicMutation.isPending}
        />
      </div>
    </Modal>
  );
}
