'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { TPropsWithClassName } from '@/shared/types/generic';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { isDev } from '@/constants';
import { useTopicsContext } from '@/contexts/TopicsContext/TopicsContext';
import { TTopic, TTopicId } from '@/features/topics/types';

import { EditTopicForm } from './EditTopicForm';

interface TEditTopicCardProps extends TPropsWithClassName {
  topicId: TTopicId;
}
type TChildProps = /* Omit<TEditTopicCardProps, 'className'> & */ {
  goBack: () => void;
  toolbarPortalRef: React.RefObject<HTMLDivElement>;
};

function Title() {
  return (
    <div
      className={cn(
        isDev && '__EditTopicCard_Title', // DEBUG
        'flex flex-1 items-center gap-2',
        // 'grid grid-cols-[2em_1fr]',
      )}
    >
      {/*
      <Button
        variant="ghost"
        size="icon"
        className="size-9 shrink-0 hover:opacity-80"
        aria-label="Back to the topics list"
        title="Back to the topics list"
        onClick={goBack}
      >
        <Icons.arrowLeft className="size-4" />
      </Button>
      */}
      <CardTitle className="flex items-center">
        <span>Edit topic</span>
      </CardTitle>
      {/*
      <CardDescription className="col-span-2 col-start-1 text-balance">
        Edit topic properties.
      </CardDescription>
      */}
    </div>
  );
}

function Toolbar({ toolbarPortalRef }: TChildProps) {
  return (
    <div
      ref={toolbarPortalRef}
      className={cn(
        isDev && '__EditTopicCard_Toolbar', // DEBUG
        '__ml-auto __shrink-0 flex flex-wrap gap-2',
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
        isDev && '__EditTopicCard_Header', // DEBUG
        'item-start flex flex-row flex-wrap',
      )}
    >
      <Title />
      <Toolbar {...props} />
    </CardHeader>
  );
}

export function EditTopicCard(props: TEditTopicCardProps) {
  const { className, topicId } = props;
  const toolbarPortalRef = React.useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { topics, routePath } = useTopicsContext();
  const topic: TTopic | undefined = React.useMemo(
    () => topics.find(({ id }) => id === topicId),
    [topics, topicId],
  );
  if (!topicId || !topic) {
    throw new Error('No such topic exists');
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
        isDev && '__EditTopicCard', // DEBUG
        'xl:col-span-2',
        'relative flex flex-1 flex-col overflow-hidden',
        className,
      )}
    >
      <Header goBack={goBack} toolbarPortalRef={toolbarPortalRef} />
      <CardContent
        className={cn(
          isDev && '__EditTopicCard_Content', // DEBUG
          'relative flex flex-1 flex-col overflow-hidden px-0',
        )}
      >
        <EditTopicForm topic={topic} onCancel={goBack} toolbarPortalRef={toolbarPortalRef} />
      </CardContent>
    </Card>
  );
}
