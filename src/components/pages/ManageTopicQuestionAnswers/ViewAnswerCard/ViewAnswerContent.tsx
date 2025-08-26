'use client';

import React from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { isDev } from '@/constants';
import { TAnswer } from '@/features/answers/types';
import { TQuestionId } from '@/features/questions/types';
import { TTopicId } from '@/features/topics/types';

import { ViewAnswerContentActions } from './ViewAnswerContentActions';
import { ViewAnswerContentSummary } from './ViewAnswerContentSummary';

interface TViewAnswerContentProps {
  topicId: TTopicId;
  questionId: TQuestionId;
  answer: TAnswer;
  className?: string;
  goBack?: () => void;
  toolbarPortalRoot: HTMLDivElement | null;
}

export function ViewAnswerContent(props: TViewAnswerContentProps) {
  const { topicId, questionId, answer, className, goBack, toolbarPortalRoot } = props;
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
          <ViewAnswerContentSummary
            topicId={topicId}
            // questionId={questionId}
            // answerId={answerId}
            answer={answer}
          />
        </ScrollArea>
      </div>
      {toolbarPortalRoot &&
        createPortal(
          <ViewAnswerContentActions
            topicId={topicId}
            questionId={questionId}
            answer={answer}
            goBack={goBack}
          />,
          toolbarPortalRoot,
        )}
    </>
  );
}
