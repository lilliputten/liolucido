'use client';

import React from 'react';

import { TReactNode } from '@/shared/types/generic';
import { cn } from '@/lib/utils';
import { DialogDescription, DialogTitle } from '@/components/ui/Dialog';
import { Modal } from '@/components/ui/Modal';
import { isDev } from '@/constants';
import { useMediaQuery } from '@/hooks';

import { ConfirmForm, TConfirmFormProps } from './ConfirmForm';

interface TConfirmModalProps
  extends Pick<
    TConfirmFormProps,
    | 'confirmButtonVariant'
    | 'confirmButtonText'
    | 'confirmButtonBusyText'
    | 'cancelButtonText'
    | 'confirmButtonIcon'
  > {
  children?: TReactNode;
  dialogDescription?: TReactNode;
  dialogTitle: TReactNode;
  handleClose?: () => void;
  handleConfirm: () => unknown;
  isPending?: boolean;
  isVisible: boolean;
}

export function ConfirmModal(props: TConfirmModalProps) {
  const {
    children,
    dialogDescription,
    dialogTitle,
    handleClose,
    handleConfirm,
    isPending,
    isVisible,
    confirmButtonVariant,
    confirmButtonText,
    confirmButtonBusyText,
    confirmButtonIcon,
    cancelButtonText,
  } = props;
  const { isMobile } = useMediaQuery();

  return (
    <Modal
      isVisible={isVisible}
      hideModal={handleClose}
      className={cn(
        isDev && '__ConfirmModal', // DEBUG
        'pb-4 text-theme-foreground',
        // '[&_button[data-id=close]]:text-theme-foreground', // Example: reaching & customizing the nested close button
        isPending && '[&>*]:pointer-events-none [&>*]:opacity-50',
      )}
    >
      <div
        className={cn(
          isDev && '__ConfirmModal_Header', // DEBUG
          !isMobile && 'max-h-[90vh]',
          'flex flex-col border-b bg-theme px-6 py-4 text-theme-foreground',
        )}
      >
        <DialogTitle className="DialogTitle">{dialogTitle}</DialogTitle>
        <DialogDescription aria-hidden="true" hidden>
          {dialogDescription}
        </DialogDescription>
      </div>
      <ConfirmForm
        className={cn(
          isDev && '__ConfirmModal_Form', // DEBUG
          'flex flex-col px-6 py-4 text-foreground',
        )}
        handleConfirm={handleConfirm}
        handleClose={handleClose}
        isPending={isPending}
        confirmButtonVariant={confirmButtonVariant}
        confirmButtonText={confirmButtonText}
        confirmButtonBusyText={confirmButtonBusyText}
        confirmButtonIcon={confirmButtonIcon}
        cancelButtonText={cancelButtonText}
      >
        {children}
      </ConfirmForm>
    </Modal>
  );
}
