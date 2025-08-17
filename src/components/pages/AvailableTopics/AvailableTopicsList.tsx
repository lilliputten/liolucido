import React from 'react';

import { TPropsWithClassName } from '@/shared/types/generic';
import { getRandomHashString } from '@/lib/helpers/strings';
import { cn } from '@/lib/utils';
import { getUnqueTopicsList, useAvailableTopics } from '@/hooks/useAvailableTopics';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { Icons } from '@/components/shared/icons';
import { isDev } from '@/constants';
import { TAvailableTopic } from '@/features/topics/types';

import { AvailableTopicsListItem } from './AvailableTopicsListItem';

const saveScrollHash = getRandomHashString();

export function AvailableTopicsList(props: TPropsWithClassName) {
  const { className } = props;
  const scrollNodeRef = React.useRef<HTMLDivElement>(null);
  const containerNodeRef = React.useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useAvailableTopics();

  const topics = React.useMemo<TAvailableTopic[]>(() => getUnqueTopicsList(data?.pages), [data]);

  const checkIfScrolledToTheEnd = React.useCallback(() => {
    if (isLoading || isFetchingNextPage || !hasNextPage || typeof window === 'undefined') {
      return;
    }
    const scrollNode = scrollNodeRef.current;
    const containerNode = containerNodeRef.current;
    if (!scrollNode || !containerNode) {
      return;
    }
    const scrollBottom = scrollNode.getBoundingClientRect().bottom;
    const containerBottom = containerNode.getBoundingClientRect().bottom;
    const extraGap = window.innerHeight / 2;
    const scrollIsPossible = containerBottom <= scrollBottom + extraGap;
    if (scrollIsPossible) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isLoading, isFetchingNextPage]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', checkIfScrolledToTheEnd);
      window.addEventListener('orientationchange', checkIfScrolledToTheEnd);
      return () => {
        window.removeEventListener('resize', checkIfScrolledToTheEnd);
        window.removeEventListener('orientationchange', checkIfScrolledToTheEnd);
      };
    }
  }, [checkIfScrolledToTheEnd]);

  return (
    <ScrollArea
      ref={scrollNodeRef}
      onScrollEvent={checkIfScrolledToTheEnd}
      saveScrollKey="AvailableTopicsList"
      saveScrollHash={saveScrollHash}
      viewportClassName={cn(
        isDev && '__AvailableTopicsList_Viewport', // DEBUG
        'relative flex flex-1 flex-col',
        '[&>div]:gap-4 [&>div]:flex-col',
      )}
      className={cn(
        isDev && '__AvailableTopicsList', // DEBUG
        'relative flex flex-1 flex-col overflow-hidden',
        className,
      )}
    >
      <div
        ref={containerNodeRef}
        className={cn(
          isDev && '__AvailableTopicsList_Container', // DEBUG
          'relative flex flex-col gap-4',
        )}
      >
        {topics.map((topic, index) => (
          <AvailableTopicsListItem key={topic.id} index={index} topic={topic} />
        ))}
        {hasNextPage && (
          <div
            className={cn(
              'pointer-events-none flex w-full items-center justify-center p-2 transition',
              !isFetchingNextPage && 'opacity-0',
            )}
          >
            <Icons.spinner className={cn('size-6', isFetchingNextPage && 'animate-spin')} />
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
