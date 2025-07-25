'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Modal } from '@/components/ui/modal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { isDev } from '@/constants';
import {
  selectTopicEventName,
  TSelectTopicLanguageData,
  TTopicId,
  TTopicLanguageData,
} from '@/features/topics/types';

import { SelectLanguageCustomForm } from './SelectLanguageCustomForm';
import { SelectLanguagePredefinedForm } from './SelectLanguagePredefinedForm';

interface TSelectTopicLanguageModalProps extends TTopicLanguageData {
  topicId?: TTopicId;
}

export function SelectTopicLanguageModal(props: TSelectTopicLanguageModalProps) {
  const { langCode, langName, langCustom, topicId } = props;
  const router = useRouter();
  const hideModal = React.useCallback(() => router.back(), [router]);
  const { isMobile } = useMediaQuery();

  const selectLanguage = React.useCallback(
    (selectedLanguage: TTopicLanguageData) => {
      // Dispatch a custom event with the selected language data
      const topicLang: TSelectTopicLanguageData = { topicId, ...selectedLanguage };
      const event = new CustomEvent<TSelectTopicLanguageData>(selectTopicEventName, {
        detail: topicLang,
        bubbles: true,
      });
      window.dispatchEvent(event);
      // Close the modal
      hideModal();
    },
    [hideModal, topicId],
  );

  return (
    <Modal
      isVisible
      hideModal={hideModal}
      className={cn(
        isDev && '__SelectTopicLanguageModal', // DEBUG
        'gap-0',
        // isPending && '[&>*]:pointer-events-none [&>*]:opacity-50',
      )}
    >
      <div
        className={cn(
          isDev && '__SelectTopicLanguageModal_Header', // DEBUG
          !isMobile && 'max-h-[90vh]',
          'flex flex-col border-b bg-accent px-8 py-4',
        )}
      >
        <DialogTitle className="DialogTitle">Select Language</DialogTitle>
        <DialogDescription className="sr-only text-sm opacity-70">
          Choose a language for a topic
        </DialogDescription>
      </div>
      <div className="flex flex-col px-8 py-4">
        <Tabs
          className={cn(
            isDev && '__SelectTopicLanguageModal_Tabs', // DEBUG
            'mt-4',
          )}
          defaultValue={langCustom ? 'Custom' : 'Predefined'}
        >
          <TabsList className={cn('__SelectTopicLanguageModal_TabsList')}>
            <TabsTrigger className="TabsTrigger" value="Predefined">
              Predefined
            </TabsTrigger>
            <TabsTrigger className="TabsTrigger" value="Custom">
              Custom
            </TabsTrigger>
          </TabsList>
          <TabsContent className="TabsContent" value="Predefined">
            <SelectLanguagePredefinedForm
              selectLanguage={selectLanguage}
              langCode={langCode}
              langName={langName}
            />
          </TabsContent>
          <TabsContent className="TabsContent" value="Custom">
            <SelectLanguageCustomForm
              selectLanguage={selectLanguage}
              langCode={langCode}
              langName={langName}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Modal>
  );
}
