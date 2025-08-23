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
import { ViewQuestionContentSummary } from './ViewQuestionContentSummary';

interface TViewQuestionContentProps {
  question: TQuestion;
  className?: string;
  goBack?: () => void;
  handleDeleteQuestion: TViewQuestionContentActionsProps['handleDeleteQuestion'];
  handleAddQuestion?: TViewQuestionContentActionsProps['handleAddQuestion'];
  toolbarPortalRef: React.RefObject<HTMLDivElement>;
}

export function ViewQuestionContent(props: TViewQuestionContentProps) {
  const { question, className, goBack, handleDeleteQuestion, handleAddQuestion, toolbarPortalRef } =
    props;
  const toolbarPortalRoot = toolbarPortalRef.current;
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
          <ViewQuestionContentSummary question={question} />
        </ScrollArea>
      </div>
      {toolbarPortalRoot &&
        createPortal(
          <ViewQuestionContentActions
            question={question}
            goBack={goBack}
            handleDeleteQuestion={handleDeleteQuestion}
            handleAddQuestion={handleAddQuestion}
          />,
          toolbarPortalRoot,
        )}
    </>
  );
}
