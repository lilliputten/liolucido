'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { TPropsWithClassName } from '@/shared/types/generic';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { isDev } from '@/constants';
import { useTopicsContext } from '@/contexts/TopicsContext/TopicsContext';
import { TTopic, TTopicId } from '@/features/topics/types';

import { EditTopicForm } from './EditTopicForm';

interface TEditTopicCardProps extends TPropsWithClassName {
  topicId: TTopicId;
}

type TToolbarProps = /* Omit<TEditTopicCardProps, 'className'> & */ {
  goBack: () => void;
  toolbarPortalRef: React.RefObject<HTMLDivElement>;
};

function Toolbar({ toolbarPortalRef }: TToolbarProps) {
  return (
    <div
      ref={toolbarPortalRef}
      className={cn(
        isDev && '__EditTopicCard_Toolbar', // DEBUG
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

export function EditTopicCard(props: TEditTopicCardProps) {
  const { className, topicId } = props;
  const toolbarPortalRef = React.useRef<HTMLDivElement>(null);
  const [toolbarPortalRoot, setToolbarPortalRoot] = React.useState<HTMLDivElement | null>(null);
  React.useEffect(() => setToolbarPortalRoot(toolbarPortalRef.current), [toolbarPortalRef]);
  const router = useRouter();
  const topicsContext = useTopicsContext();
  const { topics } = topicsContext;
  const topic: TTopic | undefined = React.useMemo(
    () => topics.find(({ id }) => id === topicId),
    [topics, topicId],
  );
  if (!topicId || !topic) {
    throw new Error('No such topic exists');
  }
  const goBack = React.useCallback(() => {
    const { href } = window.location;
    router.back();
    setTimeout(() => {
      // If still on the same page after trying to go back, fallback
      if (document.visibilityState === 'visible' && href === window.location.href) {
        router.push(topicsContext.routePath);
      }
    }, 200);
  }, [router, topicsContext]);
  return (
    <Card
      className={cn(
        isDev && '__EditTopicCard', // DEBUG
        'xl:col-span-2',
        'relative flex flex-1 flex-col overflow-hidden',
        className,
      )}
    >
      <CardHeader
        className={cn(
          isDev && '__EditTopicCard_Header', // DEBUG
          'item-start flex flex-row flex-wrap gap-4',
        )}
      >
        {/* // Title
        <div
          className={cn(
            isDev && '__EditTopicCard_Title', // DEBUG
            'flex flex-1 items-center gap-4 overflow-hidden',
          )}
        >
          <CardTitle className="flex flex-1 items-center overflow-hidden">
            <span className="truncate">Manage Topic "{topic.name}"</span>
          </CardTitle>
        </div>
        */}
        <Toolbar goBack={goBack} toolbarPortalRef={toolbarPortalRef} />
      </CardHeader>
      <CardContent
        className={cn(
          isDev && '__EditTopicCard_Content', // DEBUG
          'relative flex flex-1 flex-col overflow-hidden px-0',
        )}
      >
        <EditTopicForm topic={topic} onCancel={goBack} toolbarPortalRoot={toolbarPortalRoot} />
      </CardContent>
    </Card>
  );
}
