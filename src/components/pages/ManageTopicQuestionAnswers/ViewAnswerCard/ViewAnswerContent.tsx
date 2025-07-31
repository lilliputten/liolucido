'use client';

import React from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { isDev } from '@/constants';
import { TAnswer } from '@/features/answers/types';

import {
  TViewAnswerContentActionsProps,
  ViewAnswerContentActions,
} from './ViewAnswerContentActions';

interface TViewAnswerContentProps {
  answer: TAnswer;
  className?: string;
  goBack?: () => void;
  handleDeleteAnswer: TViewAnswerContentActionsProps['handleDeleteAnswer'];
  toolbarPortalRoot: HTMLDivElement | null;
}

export function ViewAnswerContent(props: TViewAnswerContentProps) {
  const { answer, className, goBack, handleDeleteAnswer, toolbarPortalRoot } = props;
  return (
    <>
      <div
        className={cn(
          isDev && '__ViewAnswerContent', // DEBUG
          'flex w-full flex-col gap-4 overflow-hidden',
          className,
        )}
      >
        <ScrollArea>
          <div
            className={cn(
              isDev && '__ViewAnswerContent_Stub', // DEBUG
              'flex w-full flex-col gap-4 overflow-hidden opacity-50',
              'mx-6',
              className,
            )}
          >
            Here comes some answer overview and summary.
          </div>
        </ScrollArea>
      </div>
      {toolbarPortalRoot &&
        createPortal(
          <ViewAnswerContentActions
            answer={answer}
            goBack={goBack}
            handleDeleteAnswer={handleDeleteAnswer}
          />,
          toolbarPortalRoot,
        )}
    </>
  );
}
