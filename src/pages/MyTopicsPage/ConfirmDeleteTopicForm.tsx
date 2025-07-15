'use client';

import React from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/shared/icons';
import { isDev } from '@/constants';

export interface TConfirmDeleteTopicFormProps {
  name: string;
  handleConfirm: () => Promise<unknown>;
  handleClose?: () => void;
  className?: string;
  forwardPending?: (isPending: boolean) => void;
}

export function ConfirmDeleteTopicForm(props: TConfirmDeleteTopicFormProps) {
  const { name, className, handleConfirm, handleClose, forwardPending } = props;
  const [isPending, setPending] = React.useState(false);
  React.useEffect(() => forwardPending?.(isPending), [forwardPending, isPending]);
  return (
    <div
      className={cn(
        isDev && '__ConfirmDeleteTopicForm', // DEBUG
        'flex w-full flex-col gap-4',
        className,
      )}
    >
      <p className="Text">Delete the topic &quot;{name}&quot;?</p>
      <div className="flex flex-col justify-between"></div>
      {/* Actions */}
      <div className="flex w-full gap-4">
        <Button
          type="submit"
          variant="destructive"
          className="gap-2"
          onClick={() => {
            setPending(true);
            handleConfirm?.();
          }}
        >
          <Icons.trash className="size-4" /> <span>Delete</span>
        </Button>
        <Button variant="ghost" onClick={handleClose} className="gap-2">
          <Icons.close className="size-4" />
          <span>Cancel</span>
        </Button>
      </div>
    </div>
  );
}
