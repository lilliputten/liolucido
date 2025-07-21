'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { TPropsWithClassName } from '@/shared/types/generic';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { isDev } from '@/constants';
import { useQuestionsContext } from '@/contexts/QuestionsContext';
import { TQuestion, TQuestionId } from '@/features/questions/types';

import { EditQuestionForm } from './EditQuestionForm';

interface TEditQuestionCardProps extends TPropsWithClassName {
  questionId: TQuestionId;
}
type TChildProps = {
  goBack: () => void;
  toolbarPortalRef: React.RefObject<HTMLDivElement>;
};

function Title() {
  return (
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
  );
}

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

function Header(props: TChildProps) {
  return (
    <CardHeader
      className={cn(
        isDev && '__EditQuestionCard_Header', // DEBUG
        'item-start flex flex-row flex-wrap',
      )}
    >
      <Title />
      <Toolbar {...props} />
    </CardHeader>
  );
}

export function EditQuestionCard(props: TEditQuestionCardProps) {
  const { className, questionId } = props;
  const toolbarPortalRef = React.useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { questions, routePath } = useQuestionsContext();
  const question: TQuestion | undefined = React.useMemo(
    () => questions.find(({ id }) => id === questionId),
    [questions, questionId],
  );
  if (!questionId || !question) {
    throw new Error('No such question exists');
  }
  const goBack = React.useCallback(() => {
    if (window.history.length) {
      router.back();
    } else {
      router.replace(routePath);
    }
  }, [router, routePath]);
  return (
    <Card
      className={cn(
        isDev && '__EditQuestionCard', // DEBUG
        'xl:col-span-2',
        'relative flex flex-1 flex-col overflow-hidden',
        className,
      )}
    >
      <Header goBack={goBack} toolbarPortalRef={toolbarPortalRef} />
      <CardContent
        className={cn(
          isDev && '__EditQuestionCard_Content', // DEBUG
          'relative flex flex-1 flex-col overflow-hidden px-0',
        )}
      >
        <EditQuestionForm
          question={question}
          onCancel={goBack}
          toolbarPortalRef={toolbarPortalRef}
        />
      </CardContent>
    </Card>
  );
}
