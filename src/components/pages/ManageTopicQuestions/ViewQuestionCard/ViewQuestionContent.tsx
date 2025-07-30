'use client';

import React from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { isDev } from '@/constants';
import { TQuestion } from '@/features/questions/types';

import {
  TViewQuestionContentActionsProps,
  ViewQuestionContentActions,
} from './ViewQuestionContentActions';

interface TViewQuestionContentProps {
  question: TQuestion;
  className?: string;
  goBack?: () => void;
  handleDeleteQuestion: TViewQuestionContentActionsProps['handleDeleteQuestion'];
  toolbarPortalRoot: HTMLDivElement | null;
}

export function ViewQuestionContent(props: TViewQuestionContentProps) {
  const { question, className, goBack, handleDeleteQuestion, toolbarPortalRoot } = props;
  return (
    <>
      <div
        className={cn(
          isDev && '__ViewQuestionContent', // DEBUG
          'flex w-full flex-col gap-4 overflow-hidden',
          className,
        )}
      >
        <ScrollArea>
          <div
            className={cn(
              isDev && '__ViewQuestionContent_Stub', // DEBUG
              'flex w-full flex-col gap-4 overflow-hidden',
              'mx-6',
              className,
            )}
          >
            Here comes some question overview and summary.
          </div>
        </ScrollArea>
      </div>
      {toolbarPortalRoot &&
        createPortal(
          <ViewQuestionContentActions
            question={question}
            goBack={goBack}
            handleDeleteQuestion={handleDeleteQuestion}
          />,
          toolbarPortalRoot,
        )}
    </>
  );
}
