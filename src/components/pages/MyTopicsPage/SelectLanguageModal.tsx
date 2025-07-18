'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { TSelectLanguageData } from '@/lib/types/language';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Modal } from '@/components/ui/modal';
import { isDev } from '@/constants';
import { TTopicId } from '@/features/topics/types';

import { SelectLanguageForm } from './SelectLanguageForm';

interface TSelectLanguageModalProps extends TSelectLanguageData {
  topicId: TTopicId;
}

export function SelectLanguageModal(props: TSelectLanguageModalProps) {
  const { langCode, langName, langCustom, topicId } = props;
  const router = useRouter();
  const hideModal = React.useCallback(() => router.back(), [router]);
  const [isPending, startTransition] = React.useTransition();
  const { isMobile } = useMediaQuery();

  const handleConfirm = React.useCallback(
    (selectedLanguage: TSelectLanguageData) => {
      // TODO: Remove transition
      startTransition(() => {
        // Dispatch a custom event with the selected language data
        const event = new CustomEvent('language-selected', {
          detail: {
            ...selectedLanguage,
            topicId,
          },
          bubbles: true,
        });
        console.log('[SelectLanguageModal:handleConfirm]', {
          selectedLanguage,
        });
        debugger;
        window.dispatchEvent(event);

        // Close the modal
        hideModal();
      });
    },
    [hideModal, topicId],
  );

  return (
    <Modal
      isVisible
      hideModal={hideModal}
      className={cn(
        isDev && '__SelectLanguageModal', // DEBUG
        'gap-0',
        isPending && '[&>*]:pointer-events-none [&>*]:opacity-50',
      )}
    >
      <div
        className={cn(
          isDev && '__SelectLanguageModal_Header', // DEBUG
          !isMobile && 'max-h-[90vh]',
          'flex flex-col border-b bg-accent px-8 py-4',
        )}
      >
        <DialogTitle className="DialogTitle">Select Language</DialogTitle>
        <DialogDescription className="text-sm opacity-70">
          Choose a language for topic #{topicId}
        </DialogDescription>
      </div>
      <div className="flex flex-col px-8 py-4">
        <SelectLanguageForm
          handleConfirm={handleConfirm}
          className="p-8"
          handleClose={hideModal}
          isPending={isPending}
          langCode={langCode}
          langName={langName}
          langCustom={langCustom}
        />
      </div>
    </Modal>
  );
}
