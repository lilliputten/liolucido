import React from 'react';

import { TPropsWithClassName } from '@/lib/types';
import { getRandomHashString } from '@/lib/helpers/strings';
import { cn } from '@/lib/utils';
import { ScrollAreaInfinite } from '@/components/ui/ScrollAreaInfinite';
import { isDev } from '@/constants';
import { TopicsManageScopeIds } from '@/contexts/TopicsContext/TopicsContextDefinitions';
import { useAvailableTopicsByScope } from '@/hooks';

import { AvailableTopicsListItem } from './AvailableTopicsListItem';

const saveScrollHash = getRandomHashString();

export function AvailableTopicsList(props: TPropsWithClassName) {
  const { className } = props;

  const manageScope = TopicsManageScopeIds.AVAILABLE_TOPICS;

  const {
    // data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    allTopics,
  } = useAvailableTopicsByScope({ manageScope });

  return (
    <ScrollAreaInfinite
      effectorData={allTopics}
      fetchNextPage={fetchNextPage}
      isLoading={isLoading}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage}
      saveScrollKey="AvailableTopicsList"
      saveScrollHash={saveScrollHash}
      className={cn(
        isDev && '__AvailableTopicsList', // DEBUG
        'relative flex flex-1 flex-col overflow-hidden',
        className,
      )}
      viewportClassName={cn(
        isDev && '__AvailableTopicsList_Viewport', // DEBUG
        'relative flex flex-1 flex-col',
        '[&>div]:gap-4 [&>div]:flex-col',
      )}
      containerClassName={cn(
        isDev && '__AvailableTopicsList_Container', // DEBUG
        'relative flex flex-col gap-4',
      )}
    >
      {allTopics.map((topic, index) => (
        <AvailableTopicsListItem key={topic.id} index={index} topic={topic} />
      ))}
    </ScrollAreaInfinite>
  );
}
