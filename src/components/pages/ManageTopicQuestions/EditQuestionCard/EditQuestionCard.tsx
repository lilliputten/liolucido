'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { TPropsWithClassName } from '@/shared/types/generic';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PageError } from '@/components/shared/PageError';
import { isDev } from '@/constants';
import { useQuestionsContext } from '@/contexts/QuestionsContext';
import { QuestionsBreadcrumbs } from '@/features/questions/components/QuestionsBreadcrumbs';
import { TQuestion, TQuestionId } from '@/features/questions/types';
import { useGoBack } from '@/hooks';

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

export function EditQuestionCard(props: TEditQuestionCardProps) {
  const { className, questionId } = props;
  const toolbarPortalRef = React.useRef<HTMLDivElement>(null);
  const [toolbarPortalRoot, setToolbarPortalRoot] = React.useState<HTMLDivElement | null>(null);
  React.useEffect(() => setToolbarPortalRoot(toolbarPortalRef.current), [toolbarPortalRef]);
  const [hasDeleted, setHasDeleted] = React.useState(false);
  const router = useRouter();
  const questionsContext = useQuestionsContext();
  const { questions } = questionsContext;

  const question: TQuestion | undefined = React.useMemo(
    () => questions.find(({ id }) => id === questionId),
    [questions, questionId],
  );

  if (!questionId || (!question && !hasDeleted)) {
    throw new Error('No such question exists');
  }

  const goBack = useGoBack(questionsContext.routePath);

  // Add Question Modal
  const handleAddQuestion = React.useCallback(() => {
    router.push(`${questionsContext.routePath}/add`);
  }, [router, questionsContext]);

  // Delete Question Modal
  const handleDeleteQuestion = React.useCallback(() => {
    const hasQuestion = questionsContext.questions.find(({ id }) => id === questionId);
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
        setHasDeleted(true);
      }
    };
    window.addEventListener(topicQuestionDeletedEventId, handleQuestionDeleted as EventListener);
    return () => {
      window.removeEventListener(
        topicQuestionDeletedEventId,
        handleQuestionDeleted as EventListener,
      );
    };
  }, [questionId, router, questionsContext]);

  // Effect:hasDeleted
  React.useEffect(() => {
    if (hasDeleted) {
      const { href } = window.location;
      router.back();
      setTimeout(() => {
        // If still on the same page after trying to go back, fallback
        if (document.visibilityState === 'visible' && href === window.location.href) {
          router.push(questionsContext.routePath);
        }
      }, 200);
    }
  }, [hasDeleted, questionsContext, router]);

  if (hasDeleted) {
    // TODO: Show 'Question has been removed' info?
    return <PageError iconName="trash" title="The question has been removed" />;
  }

  return (
    <Card
      className={cn(
        isDev && '__EditQuestionCard', // DEBUG
        'relative flex flex-1 flex-col overflow-hidden',
        className,
      )}
    >
      <CardHeader
        className={cn(
          isDev && '__EditQuestionCard_Header', // DEBUG
          'item-start flex flex-col gap-4 lg:flex-row',
        )}
      >
        <div
          className={cn(
            isDev && '__ManageTopicQuestionsListCard_TitleWrapper', // DEBUG
            'flex flex-1 flex-col justify-center gap-2 overflow-hidden',
          )}
        >
          <QuestionsBreadcrumbs
            className={cn(
              isDev && '__ManageTopicQuestionsListCard_Breadcrumbs', // DEBUG
            )}
            questionId={questionId}
            // inactiveQuestion
            // inactiveQuestions
          />
          {/*
          <CardTitle className="flex flex-1 items-center">
            <span>Edit question</span>
          </CardTitle>
          */}
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
            toolbarPortalRoot={toolbarPortalRoot}
            handleDeleteQuestion={handleDeleteQuestion}
            handleAddQuestion={handleAddQuestion}
          />
        )}
      </CardContent>
    </Card>
  );
}
