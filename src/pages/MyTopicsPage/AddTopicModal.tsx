import React from 'react';

import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Modal } from '@/components/ui/modal';
import { isDev } from '@/constants';

import { AddTopicForm, TAddTopicFormProps } from './AddTopicForm';

interface TAddTopicModalProps {
  show: boolean;
  toggle: React.Dispatch<React.SetStateAction<boolean>>;
  handleAddTopic: TAddTopicFormProps['handleAddTopic']; // (p: TAddTopicParams) => Promise<unknown>;
}

export function AddTopicModal(props: TAddTopicModalProps) {
  const {
    show,
    toggle,
    handleAddTopic,
    // ...restProps
  } = props;
  const [isPending, setPending] = React.useState(false);
  const { isMobile } = useMediaQuery();
  return (
    <Modal
      showModal={show}
      setShowModal={toggle}
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
      <div
        className={cn(
          isDev && '__AddTopicModal_Body', // DEBUG
          'flex flex-col px-8 py-4',
        )}
      >
        <AddTopicForm
          handleAddTopic={handleAddTopic}
          className={cn('__AddTopicModal__Form', 'p-8')}
          forwardPending={setPending}
          handleClose={() => toggle(false)}
        />
      </div>
    </Modal>
  );
}
