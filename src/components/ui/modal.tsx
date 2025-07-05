'use client';

import React, { Dispatch, SetStateAction } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { X } from 'lucide-react';
import { Drawer } from 'vaul';

import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { isDev } from '@/constants';

interface ModalProps {
  children: React.ReactNode;
  className?: string;
  showModal?: boolean;
  // setShowModal?: (v: boolean) => void; // Dispatch<SetStateAction<boolean>>;
  setShowModal?: Dispatch<SetStateAction<boolean>>;
  onClose?: () => void;
  desktopOnly?: boolean;
  preventDefaultClose?: boolean;
  title?: string;
  hiddenTitle?: boolean;
  description?: string;
}

export function Modal({
  children,
  className,
  showModal,
  setShowModal,
  onClose,
  desktopOnly,
  preventDefaultClose,
  title,
  hiddenTitle,
  description,
}: ModalProps) {
  // const router = useRouter();

  const closeModal = ({ dragged }: { dragged?: boolean } = {}) => {
    if (preventDefaultClose && !dragged) {
      return;
    }
    // fire onClose event if provided
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    onClose && onClose();

    // if setShowModal is defined, use it to close modal
    if (setShowModal) {
      setShowModal(false);
    }
  };
  const { isMobile } = useMediaQuery();

  if (isMobile && !desktopOnly) {
    return (
      <Drawer.Root
        open={setShowModal ? showModal : true}
        onOpenChange={(open) => {
          if (!open) {
            closeModal({ dragged: true });
          }
        }}
      >
        <Drawer.Overlay
          className={cn(
            'bg-black/30', // Dark background (should be synced in both dialog and modal)
            'fixed inset-0 z-40 backdrop-blur-sm',
          )}
        />
        <Drawer.Portal>
          <Drawer.Content
            className={cn(
              isDev && '__modal_Drawer_Content',
              'fixed',
              'inset-x-0',
              'inset-y-0',
              'z-50 overflow-hidden',
              'border bg-background',
              className,
            )}
          >
            {children}
            <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="size-4 text-white" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </Drawer.Content>
          <Drawer.Overlay />
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  const titleNode = <DialogTitle>{title}</DialogTitle>;
  const showTitle = !hiddenTitle && !!title;
  const descriptionNode = <DialogDescription>{description}</DialogDescription>;

  return (
    <Dialog
      open={setShowModal ? showModal : true}
      onOpenChange={(open) => {
        if (!open) {
          closeModal();
        }
      }}
    >
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
        className={cn(
          isDev && '__DialogContent',
          'overflow-hidden p-0 md:max-w-md md:rounded-2xl md:border',
          className,
        )}
      >
        {showTitle && titleNode}
        <VisuallyHidden>
          {!showTitle && titleNode}
          {descriptionNode}
        </VisuallyHidden>
        {children}
      </DialogContent>
    </Dialog>
  );
}
