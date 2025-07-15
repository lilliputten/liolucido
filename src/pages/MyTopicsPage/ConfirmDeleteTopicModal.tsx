import React from 'react';

import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Modal } from '@/components/ui/modal';
import { isDev } from '@/constants';
import { TTopic } from '@/features/topics/types';

import { ConfirmDeleteTopicForm, TConfirmDeleteTopicFormProps } from './ConfirmDeleteTopicForm';

interface TConfirmDeleteTopicModalProps {
  deletingTopic?: TTopic;
  hideModal: () => void;
  handleConfirm: TConfirmDeleteTopicFormProps['handleConfirm'];
}

export function ConfirmDeleteTopicModal(props: TConfirmDeleteTopicModalProps) {
  const { deletingTopic, hideModal, handleConfirm } = props;
  const isVisible = !!deletingTopic;
  const [isPending, setPending] = React.useState(false);
  const { isMobile } = useMediaQuery();
  return (
    <Modal
      isVisible={isVisible}
      hideModal={hideModal}
      className={cn(
        isDev && '__ConfirmDeleteTopicModal', // DEBUG
        'gap-0',
        isPending && '[&>*]:pointer-events-none [&>*]:opacity-50',
      )}
    >
      <div
        className={cn(
          isDev && '__ConfirmDeleteTopicModal_Header', // DEBUG
          !isMobile && 'max-h-[90vh]',
          'flex flex-col border-b bg-accent px-8 py-4',
        )}
      >
        <DialogTitle className="DialogTitle">Delete Topic?</DialogTitle>
        <DialogDescription aria-hidden="true" hidden>
          Delete topic dialog
        </DialogDescription>
      </div>
      <div
        className={cn(
          isDev && '__ConfirmDeleteTopicModal_Body', // DEBUG
          'flex flex-col px-8 py-4',
        )}
      >
        <ConfirmDeleteTopicForm
          name={deletingTopic?.name || ''}
          handleConfirm={handleConfirm}
          className={cn(
            isDev && '__ConfirmDeleteTopicModal__Form', // DEBUG
            'p-8',
          )}
          forwardPending={setPending}
          handleClose={hideModal}
        />
      </div>
    </Modal>
  );
}
