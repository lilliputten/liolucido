'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { TPropsWithClassName } from '@/shared/types/generic';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { isDev } from '@/constants';
import { useAnswersContext } from '@/contexts/AnswersContext/AnswersContext';
import { AnswersBreadcrumbs } from '@/features/answers/components/AnswersBreadcrumbs';
import { TAnswer, TAnswerId } from '@/features/answers/types';
import { TQuestionId } from '@/features/questions/types';
import { TTopicId } from '@/features/topics/types';
import { useGoBack } from '@/hooks';

import { ViewAnswerContent } from './ViewAnswerContent';

interface TViewAnswerCardProps extends TPropsWithClassName {
  topicId: TTopicId;
  questionId: TQuestionId;
  answerId: TAnswerId;
}

export function ViewAnswerCard(props: TViewAnswerCardProps) {
  const { className, topicId, questionId, answerId } = props;
  const toolbarPortalRef = React.useRef<HTMLDivElement>(null);
  const [toolbarPortalRoot, setToolbarPortalRoot] = React.useState<HTMLDivElement | null>(null);
  React.useEffect(() => setToolbarPortalRoot(toolbarPortalRef.current), [toolbarPortalRef]);
  const router = useRouter();
  const answersContext = useAnswersContext();
  const { answers } = answersContext;
  const answer: TAnswer | undefined = React.useMemo(
    () => answers.find(({ id }) => id === answerId),
    [answers, answerId],
  );
  if (!answerId || !answer) {
    throw new Error('No such answer exists');
  }
  const goBack = useGoBack(answersContext.routePath);

  // Add Answer Modal
  const handleAddAnswer = React.useCallback(() => {
    router.push(`${answersContext.routePath}/add`);
  }, [router, answersContext]);

  // Delete Answer Modal
  const handleDeleteAnswer = React.useCallback(() => {
    const hasAnswer = answersContext.answers.find(({ id }) => id === answer.id);
    if (hasAnswer) {
      router.push(`${answersContext.routePath}/delete?answerId=${answer.id}&from=ViewAnswerCard`);
    } else {
      toast.error('The requested answer does not exist.');
      router.replace(answersContext.routePath);
    }
  }, [router, answersContext, answer]);

  return (
    <Card
      className={cn(
        isDev && '__ViewAnswerCard', // DEBUG
        'xl:col-span-2',
        'relative flex flex-1 flex-col overflow-hidden',
        className,
      )}
    >
      <CardHeader
        className={cn(
          isDev && '__ViewAnswerCard_Header', // DEBUG
          'item-start flex flex-col gap-4', // md:flex-row',
        )}
      >
        <div
          className={cn(
            isDev && '__EditAnswerCard_TitleWrapper', // DEBUG
            'flex flex-1 flex-col justify-center gap-2 overflow-hidden',
          )}
        >
          <AnswersBreadcrumbs
            className={cn(
              isDev && '__EditAnswerCard_Breadcrumbs', // DEBUG
            )}
            answerId={answerId}
            inactiveAnswer
          />
          {/* // UNUSED: Title
            <CardTitle className="flex flex-1 items-center overflow-hidden">
              <span className="truncate">Show Answer</span>
            </CardTitle>
            */}
        </div>
        <div
          ref={toolbarPortalRef}
          className={cn(
            isDev && '__ViewAnswerCard_Toolbar', // DEBUG
            'flex flex-wrap items-center gap-2',
          )}
        />
      </CardHeader>

      <CardContent
        className={cn(
          isDev && '__ViewAnswerCard_Content', // DEBUG
          'relative flex flex-1 flex-col overflow-hidden px-0',
        )}
      >
        <ViewAnswerContent
          topicId={topicId}
          questionId={questionId}
          // answerId={answerId}
          answer={answer}
          goBack={goBack}
          handleDeleteAnswer={handleDeleteAnswer}
          handleAddAnswer={handleAddAnswer}
          toolbarPortalRoot={toolbarPortalRoot}
        />
      </CardContent>
    </Card>
  );
}
