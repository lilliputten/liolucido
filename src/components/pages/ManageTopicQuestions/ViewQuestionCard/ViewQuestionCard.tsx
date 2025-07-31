'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { TPropsWithClassName } from '@/shared/types/generic';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { isDev } from '@/constants';
import { useQuestionsContext } from '@/contexts/QuestionsContext/QuestionsContext';
import { QuestionsBreadcrumbs } from '@/features/questions/components/QuestionsBreadcrumbs';
import { TQuestion, TQuestionId } from '@/features/questions/types';

import { ViewQuestionContent } from './ViewQuestionContent';

interface TViewQuestionCardProps extends TPropsWithClassName {
  questionId: TQuestionId;
}

export function ViewQuestionCard(props: TViewQuestionCardProps) {
  const { className, questionId } = props;
  const toolbarPortalRef = React.useRef<HTMLDivElement>(null);
  const [toolbarPortalRoot, setToolbarPortalRoot] = React.useState<HTMLDivElement | null>(null);
  React.useEffect(() => setToolbarPortalRoot(toolbarPortalRef.current), [toolbarPortalRef]);
  const router = useRouter();
  const questionsContext = useQuestionsContext();
  const { questions } = questionsContext;
  const question: TQuestion | undefined = React.useMemo(
    () => questions.find(({ id }) => id === questionId),
    [questions, questionId],
  );
  if (!questionId || !question) {
    throw new Error('No such question exists');
  }
  const goBack = React.useCallback(() => {
    const { href } = window.location;
    router.back();
    setTimeout(() => {
      // If still on the same page after trying to go back, fallback
      if (document.visibilityState === 'visible' && href === window.location.href) {
        router.push(questionsContext.routePath);
      }
    }, 200);
  }, [router, questionsContext]);

  // Delete Question Modal
  const handleDeleteQuestion = React.useCallback(() => {
    const hasQuestion = questionsContext.questions.find(({ id }) => id === question.id);
    if (hasQuestion) {
      router.push(
        `${questionsContext.routePath}/delete?questionId=${question.id}&from=ViewQuestionCard`,
      );
    } else {
      toast.error('The requested question does not exist.');
      router.replace(questionsContext.routePath);
    }
  }, [router, questionsContext, question]);

  return (
    <Card
      className={cn(
        isDev && '__ViewQuestionCard', // DEBUG
        'xl:col-span-2',
        'relative flex flex-1 flex-col overflow-hidden',
        className,
      )}
    >
      <CardHeader
        className={cn(
          isDev && '__ViewQuestionCard_Header', // DEBUG
          'item-start flex flex-col gap-4 md:flex-row',
        )}
      >
        <div
          className={cn(
            isDev && '__EditQuestionCard_TitleWrapper', // DEBUG
            'flex flex-1 flex-col justify-center gap-2 overflow-hidden',
          )}
        >
          <QuestionsBreadcrumbs
            className={cn(
              isDev && '__EditQuestionCard_Breadcrumbs', // DEBUG
            )}
            questionId={questionId}
            inactiveQuestion
          />
          {/* // UNUSED: Title
            <CardTitle className="flex flex-1 items-center overflow-hidden">
              <span className="truncate">Show Question</span>
            </CardTitle>
            */}
        </div>
        <div
          ref={toolbarPortalRef}
          className={cn(
            isDev && '__ViewQuestionCard_Toolbar', // DEBUG
            'flex flex-wrap items-center gap-2',
          )}
        />
      </CardHeader>

      <CardContent
        className={cn(
          isDev && '__ViewQuestionCard_Content', // DEBUG
          'relative flex flex-1 flex-col overflow-hidden px-0',
        )}
      >
        <ViewQuestionContent
          question={question}
          goBack={goBack}
          handleDeleteQuestion={handleDeleteQuestion}
          toolbarPortalRoot={toolbarPortalRoot}
        />
      </CardContent>
    </Card>
  );
}
