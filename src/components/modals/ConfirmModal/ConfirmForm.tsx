'use client';

import React from 'react';

import { TReactNode } from '@/shared/types/generic';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Icons, TIconsKey } from '@/components/shared/icons';
import { isDev } from '@/constants';

export interface TConfirmFormProps {
  handleConfirm: () => unknown;
  handleClose?: () => void;
  className?: string;
  isPending?: boolean;
  children?: TReactNode;
  confirmButtonVariant?: React.ComponentProps<typeof Button>['variant'];
  confirmButtonText?: string;
  confirmButtonBusyText?: string;
  confirmButtonIconName?: TIconsKey;
  cancelButtonText?: string;
}

export function ConfirmForm(props: TConfirmFormProps) {
  const {
    children,
    className,
    handleConfirm,
    handleClose,
    isPending,
    confirmButtonVariant,
    confirmButtonText = 'Ok',
    confirmButtonBusyText,
    confirmButtonIconName = 'check',
    cancelButtonText = 'Cancel',
  } = props;

  const onClose = (ev: React.MouseEvent) => {
    if (handleClose) {
      handleClose();
    }
    ev.preventDefault();
  };

  const Icon = isPending ? Icons.spinner : Icons[confirmButtonIconName];
  const buttonText =
    !isPending || !confirmButtonBusyText ? confirmButtonText : confirmButtonBusyText;

  return (
    <div
      className={cn(
        isDev && '__ConfirmForm', // DEBUG
        'flex w-full flex-col gap-4',
        className,
      )}
    >
      {children}
      <div className="flex flex-col justify-between"></div>
      {/* Actions */}
      <div className="flex w-full gap-4">
        <Button
          type="submit"
          variant={confirmButtonVariant}
          className="gap-2"
          onClick={handleConfirm}
        >
          <Icon className={cn('size-4', isPending && 'animate-spin')} /> <span>{buttonText}</span>
        </Button>
        <Button variant="ghost" onClick={onClose} className="gap-2">
          <Icons.close className="size-4" />
          <span>{cancelButtonText}</span>
        </Button>
      </div>
    </div>
  );
}
