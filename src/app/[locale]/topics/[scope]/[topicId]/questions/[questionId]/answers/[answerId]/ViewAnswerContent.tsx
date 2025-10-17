'use client';

import React from 'react';

import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { isDev } from '@/constants';
import { TAvailableAnswer } from '@/features/answers/types';
import { TAvailableQuestion } from '@/features/questions/types';
import { TAvailableTopic } from '@/features/topics/types';

import { ViewAnswerContentSummary } from './ViewAnswerContentSummary';

interface TViewAnswerContentProps {
  topic: TAvailableTopic;
  question: TAvailableQuestion;
  answer: TAvailableAnswer;
  className?: string;
}

export function ViewAnswerContent(props: TViewAnswerContentProps) {
  const { topic, question, answer, className } = props;
  return (
    <div
      className={cn(
        isDev && '__ViewAnswerContent', // DEBUG
        'flex w-full flex-col gap-4 overflow-hidden',
        className,
      )}
    >
      <ScrollArea>
        <ViewAnswerContentSummary topic={topic} question={question} answer={answer} />
      </ScrollArea>
    </div>
  );
}
