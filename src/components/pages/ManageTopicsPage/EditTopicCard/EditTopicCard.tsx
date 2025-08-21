'use client';

import React from 'react';

import { TPropsWithClassName } from '@/shared/types/generic';
import { cn } from '@/lib/utils';
import { useAvailableTopicsByScope } from '@/hooks/useAvailableTopics';
import { useGoBack } from '@/hooks/useGoBack';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { isDev } from '@/constants';
import { TopicsScopeBreadcrumbs } from '@/features/topics/components/TopicsBreadcrumbs';
import { TTopic, TTopicId } from '@/features/topics/types';
import { useManageTopicsStore } from '@/stores/ManageTopicsStoreProvider';

import { EditTopicForm } from './EditTopicForm';

interface TEditTopicCardProps extends TPropsWithClassName {
  topicId: TTopicId;
}

export function EditTopicCard(props: TEditTopicCardProps) {
  const { manageScope } = useManageTopicsStore();
  const routePath = `/topics/${manageScope}`;
  const goBack = useGoBack(routePath);
  const { className, topicId } = props;
  const toolbarPortalRef = React.useRef<HTMLDivElement>(null);
  const availableTopics = useAvailableTopicsByScope({ manageScope });
  const { allTopics, isFetched } = availableTopics;

  const topic: TTopic | undefined = React.useMemo(
    () => allTopics.find(({ id }) => id === topicId),
    [allTopics, topicId],
  );

  // No data loaded yet
  if (!isFetched) {
    return (
      <div
        className={cn(
          isDev && '__EditTopicCard_Skeleton', // DEBUG
          'size-full',
          'flex flex-1 flex-col gap-4 py-4',
          className,
        )}
      >
        <Skeleton className="h-8 w-48 rounded-lg" />
        <Skeleton className="h-8 w-full rounded-lg" />
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  // Error: topic hasn't been found
  if (!topicId || !topic) {
    throw new Error('No such topic exists');
  }

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
          'item-start flex flex-col gap-4',
        )}
      >
        <TopicsScopeBreadcrumbs
          className={cn(
            isDev && '__EditTopicCard_Breadcrumbs', // DEBUG
          )}
          scope={manageScope}
          topic={topic}
        />
        <div className="item-start flex flex-row flex-wrap gap-4">
          {/* // Title
          <CardTitle className="flex flex-1 items-center overflow-hidden">
            <span className="truncate">Manage Topic "{topic.name}"</span>
          </CardTitle>
          <Toolbar goBack={goBack} toolbarPortalRef={toolbarPortalRef} />
          */}
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
        </div>
      </CardHeader>
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
