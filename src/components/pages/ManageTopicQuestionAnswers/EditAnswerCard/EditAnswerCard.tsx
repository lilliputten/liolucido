'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { TPropsWithClassName } from '@/shared/types/generic';
import { cn } from '@/lib/utils';
import { useGoBack } from '@/hooks/useGoBack';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PageError } from '@/components/shared/PageError';
import { isDev } from '@/constants';
import { useAnswersContext } from '@/contexts/AnswersContext';
import { AnswersBreadcrumbs } from '@/features/answers/components/AnswersBreadcrumbs';
import { TAnswer, TAnswerId } from '@/features/answers/types';

import { topicAnswerDeletedEventId } from '../DeleteAnswerModal';
import { EditAnswerForm } from './EditAnswerForm';

interface TEditAnswerCardProps extends TPropsWithClassName {
  answerId: TAnswerId;
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
        isDev && '__EditAnswerCard_Toolbar', // DEBUG
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

export function EditAnswerCard(props: TEditAnswerCardProps) {
  const { className, answerId } = props;
  const toolbarPortalRef = React.useRef<HTMLDivElement>(null);
  const [toolbarPortalRoot, setToolbarPortalRoot] = React.useState<HTMLDivElement | null>(null);
  React.useEffect(() => setToolbarPortalRoot(toolbarPortalRef.current), [toolbarPortalRef]);
  const [hasDeleted, setHasDeleted] = React.useState(false);
  const router = useRouter();
  const answersContext = useAnswersContext();
  const { answers } = answersContext;

  const answer: TAnswer | undefined = React.useMemo(
    () => answers.find(({ id }) => id === answerId),
    [answers, answerId],
  );

  if (!answerId || (!answer && !hasDeleted)) {
    throw new Error('No such answer exists');
  }

  const goBack = useGoBack(answersContext.routePath);

  // Add Answer Modal
  const handleAddAnswer = React.useCallback(() => {
    router.push(`${answersContext.routePath}/add`);
  }, [router, answersContext]);

  // Delete Answer Modal
  const handleDeleteAnswer = React.useCallback(() => {
    const hasAnswer = answersContext.answers.find(({ id }) => id === answerId);
    if (hasAnswer) {
      router.push(`${answersContext.routePath}/delete?answerId=${answerId}`);
    } else {
      toast.error('The requested answer does not exist.');
      router.replace(answersContext.routePath);
    }
  }, [router, answersContext, answerId]);

  // Watch if the answer has been deleted
  React.useEffect(() => {
    const handleAnswerDeleted = (event: CustomEvent<TAnswer>) => {
      const { id } = event.detail;
      // Make sure the event is for this topic
      if (answerId === id) {
        setHasDeleted(true);
      }
    };
    window.addEventListener(topicAnswerDeletedEventId, handleAnswerDeleted as EventListener);
    return () => {
      window.removeEventListener(topicAnswerDeletedEventId, handleAnswerDeleted as EventListener);
    };
  }, [answerId, router, answersContext]);

  // Effect:hasDeleted
  React.useEffect(() => {
    if (hasDeleted) {
      const { href } = window.location;
      router.back();
      setTimeout(() => {
        // If still on the same page after trying to go back, fallback
        if (document.visibilityState === 'visible' && href === window.location.href) {
          router.push(answersContext.routePath);
        }
      }, 200);
    }
  }, [hasDeleted, answersContext, router]);

  if (hasDeleted) {
    // TODO: Show 'Answer has been removed' info?
    return <PageError iconName="trash" title="The answer has been removed" />;
  }

  return (
    <Card
      className={cn(
        isDev && '__EditAnswerCard', // DEBUG
        'relative flex flex-1 flex-col overflow-hidden',
        className,
      )}
    >
      <CardHeader
        className={cn(
          isDev && '__EditAnswerCard_Header', // DEBUG
          'item-start flex flex-col gap-4', // lg:flex-row',
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
            // inactiveAnswers
          />
          {/* // UNUSED: Tilte & description
          <CardTitle className="flex flex-1 items-center overflow-hidden">
            <span className="truncate">Edit answer</span>
          </CardTitle>
          */}
        </div>
        <Toolbar {...props} goBack={goBack} toolbarPortalRef={toolbarPortalRef} />
      </CardHeader>
      <CardContent
        className={cn(
          isDev && '__EditAnswerCard_Content', // DEBUG
          'relative flex flex-1 flex-col overflow-hidden px-0',
        )}
      >
        {answer && (
          <EditAnswerForm
            answer={answer}
            onCancel={goBack}
            toolbarPortalRoot={toolbarPortalRoot}
            handleDeleteAnswer={handleDeleteAnswer}
            handleAddAnswer={handleAddAnswer}
          />
        )}
      </CardContent>
    </Card>
  );
}
