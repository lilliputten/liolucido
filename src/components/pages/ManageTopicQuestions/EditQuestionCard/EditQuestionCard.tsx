'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { TPropsWithClassName } from '@/shared/types/generic';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageError } from '@/components/shared/PageError';
import { isDev } from '@/constants';
import { useQuestionsContext } from '@/contexts/QuestionsContext';
import { TQuestion, TQuestionId } from '@/features/questions/types';

import { topicQuestionDeletedEventId } from '../DeleteQuestionModal';
import { EditQuestionForm } from './EditQuestionForm';

interface TEditQuestionCardProps extends TPropsWithClassName {
  questionId: TQuestionId;
}
type TChildProps = {
  goBack: () => void;
  toolbarPortalRef: React.RefObject<HTMLDivElement>;
};

function Toolbar({ toolbarPortalRef }: TChildProps) {
  return (
    <div
      ref={toolbarPortalRef}
      className={cn(
        isDev && '__EditQuestionCard_Toolbar', // DEBUG
        'flex flex-wrap gap-2',
      )}
    >
      {/* // Example
      <Button disabled variant="ghost" size="sm" className="flex gap-2 px-4">
        <Link href="#" className="flex items-center gap-2">
          <Icons.refresh className="hidden size-4 sm:block" />
          <span>Refresh</span>
        </Link>
      </Button>
      */}
    </div>
  );
}

type TMemo = {
  deleted?: boolean;
};

export function EditQuestionCard(props: TEditQuestionCardProps) {
  const memo = React.useMemo<TMemo>(() => ({}), []);
  const { className, questionId } = props;
  const toolbarPortalRef = React.useRef<HTMLDivElement>(null);
  const router = useRouter();
  const questionsContext = useQuestionsContext();
  const { questions, routePath } = questionsContext;

  const question: TQuestion | undefined = React.useMemo(
    () => questions.find(({ id }) => id === questionId),
    [questions, questionId],
  );

  if (!questionId || (!question && !memo.deleted)) {
    throw new Error('No such question exists');
  }

  const goBack = React.useCallback(() => {
    if (window.history.length) {
      router.back();
    } else {
      router.replace(routePath);
    }
  }, [router, routePath]);

  // Delete Question Modal
  const handleDeleteQuestion = React.useCallback(() => {
    const hasQuestion = questionsContext.questions.find(({ id }) => id === questionId);
    debugger;
    if (hasQuestion) {
      router.push(`${questionsContext.routePath}/delete?questionId=${questionId}`);
    } else {
      toast.error('The requested question does not exist.');
      router.replace(questionsContext.routePath);
    }
  }, [router, questionsContext, questionId]);

  // Watch if the question has been deleted
  React.useEffect(() => {
    const handleQuestionDeleted = (event: CustomEvent<TQuestion>) => {
      const { id } = event.detail;
      // Make sure the event is for this topic
      if (questionId === id) {
        const routePath = questionsContext.routePath;
        /* console.log('[EditQuestionCard:handleQuestionDeleted]', {
         *   routePath,
         *   topicQuestionDeletedEventId,
         *   questionsContext,
         *   memo,
         * });
         */
        memo.deleted = true;
        // Move out to the questions list (or just go back with a router?)
        router.replace(routePath);
      }
    };
    window.addEventListener(topicQuestionDeletedEventId, handleQuestionDeleted as EventListener);
    return () => {
      window.removeEventListener(
        topicQuestionDeletedEventId,
        handleQuestionDeleted as EventListener,
      );
    };
  }, [memo, questionId, router, questionsContext]);

  if (memo.deleted) {
    // TODO: Show 'Question has been removed' info?
    return <PageError iconName="trash" title="The question has been removed" />;
  }

  return (
    <Card
      className={cn(
        isDev && '__EditQuestionCard', // DEBUG
        // 'xl:col-span-2', // ???
        'relative flex flex-1 flex-col overflow-hidden',
        className,
      )}
    >
      <CardHeader
        className={cn(
          isDev && '__EditQuestionCard_Header', // DEBUG
          'item-start flex flex-row flex-wrap',
        )}
      >
        <div
          className={cn(
            isDev && '__EditQuestionCard_Title', // DEBUG
            'flex flex-1 items-center gap-2',
          )}
        >
          <CardTitle className="flex items-center">
            <span>Edit question</span>
          </CardTitle>
        </div>
        <Toolbar {...props} goBack={goBack} toolbarPortalRef={toolbarPortalRef} />
      </CardHeader>
      <CardContent
        className={cn(
          isDev && '__EditQuestionCard_Content', // DEBUG
          'relative flex flex-1 flex-col overflow-hidden px-0',
        )}
      >
        {question && (
          <EditQuestionForm
            question={question}
            onCancel={goBack}
            toolbarPortalRef={toolbarPortalRef}
            handleDeleteQuestion={handleDeleteQuestion}
          />
        )}
      </CardContent>
    </Card>
  );
}
