'use client';

import React from 'react';

import { TPropsWithClassName } from '@/shared/types/generic';
import { cn } from '@/lib/utils';
import { useAvailableTopicById } from '@/hooks/useAvailableTopicById';
import { useAvailableTopicsByScope } from '@/hooks/useAvailableTopics';
import { useGoBack } from '@/hooks/useGoBack';
import { useGoToTheRoute } from '@/hooks/useGoToTheRoute';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { Skeleton } from '@/components/ui/skeleton';
import { isDev } from '@/constants';
import { TopicsScopeBreadcrumbs } from '@/features/topics/components/TopicsBreadcrumbs';
import { TTopicId } from '@/features/topics/types';
import { useManageTopicsStore } from '@/stores/ManageTopicsStoreProvider';

import { ViewTopicContentActions } from './ViewTopicContentActions';
import { ViewTopicContentSummary } from './ViewTopicContentSummary';

interface TViewTopicCardProps extends TPropsWithClassName {
  topicId: TTopicId;
}

export function ViewTopicCard(props: TViewTopicCardProps) {
  const { manageScope } = useManageTopicsStore();
  const routePath = `/topics/${manageScope}`;
  const goBack = useGoBack(routePath);
  const goToTheRoute = useGoToTheRoute();
  const { className, topicId } = props;
  const availableTopics = useAvailableTopicsByScope({ manageScope });
  const {
    allTopics,
    isFetched: isTopicsFetched,
    // isLoading: isTopicsLoading,
    queryKey: availableTopicsQueryKey,
    queryProps: availableTopicsQueryProps,
  } = availableTopics;

  const availableTopicQuery = useAvailableTopicById({
    id: topicId,
    availableTopicsQueryKey,
    // ...availableTopicsQueryProps,
    includeWorkout: availableTopicsQueryProps.includeWorkout,
    includeUser: availableTopicsQueryProps.includeUser,
    includeQuestionsCount: availableTopicsQueryProps.includeQuestionsCount,
  });
  const {
    topic,
    isFetched: isTopicFetched,
    isLoading: isTopicLoading,
    // isCached: isTopicCached,
  } = availableTopicQuery;

  // Delete Topic Modal
  const handleDeleteTopic = React.useCallback(() => {
    const url = `${routePath}/delete?topicId=${topicId}&from=ViewTopicCard`;
    goToTheRoute(url);
  }, [goToTheRoute, routePath, topicId]);

  // No data loaded yet: display skeleton
  if (!topic && (!isTopicsFetched || !isTopicFetched || isTopicLoading)) {
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
    const error = new Error('No such topic exists');
    // eslint-disable-next-line no-console
    console.error('[ViewTopicCard]', error.message, {
      topicId,
      topic,
      isFetched: isTopicsFetched,
      allTopics,
      error,
    });
    debugger; // eslint-disable-line no-debugger
    throw error;
  }

  return (
    <Card
      className={cn(
        isDev && '__ViewTopicCard', // DEBUG
        'xl:col-span-2',
        'relative flex flex-1 flex-col overflow-hidden',
        className,
      )}
    >
      <CardHeader
        className={cn(
          isDev && '__ViewTopicCard_Header', // DEBUG
          'item-start flex flex-col gap-4 md:flex-row',
        )}
      >
        <div
          className={cn(
            isDev && '__EditTopicCard_TitleWrapper', // DEBUG
            'flex flex-1 flex-col justify-center gap-2 overflow-hidden',
          )}
        >
          <TopicsScopeBreadcrumbs
            className={cn(
              isDev && '__EditTopicCard_Breadcrumbs', // DEBUG
            )}
            scope={manageScope}
            topic={topic}
            inactiveLast
          />
          {/* // UNUSED: Title
            <CardTitle className="flex flex-1 items-center overflow-hidden">
              <span className="truncate">Show Topic</span>
            </CardTitle>
            */}
        </div>
        <div
          className={cn(
            isDev && '__ViewTopicCard_Toolbar', // DEBUG
            'flex flex-wrap items-center gap-2',
          )}
        >
          <ViewTopicContentActions
            topic={topic}
            goBack={goBack}
            handleDeleteTopic={handleDeleteTopic}
          />
        </div>
      </CardHeader>
      <CardContent
        className={cn(
          isDev && '__ViewTopicCard_Content', // DEBUG
          'relative flex flex-1 flex-col overflow-hidden px-0',
        )}
      >
        <ScrollArea>
          <ViewTopicContentSummary topic={topic} />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
