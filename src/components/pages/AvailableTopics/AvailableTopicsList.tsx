import React from 'react';
import { toast } from 'sonner';

import { TPropsWithClassName } from '@/shared/types/generic';
import { getRandomHashString } from '@/lib/helpers/strings';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { Icons } from '@/components/shared/icons';
import { isDev } from '@/constants';
import { useTopicsContext } from '@/contexts/TopicsContext';
import { getAvailableTopics } from '@/features/topics/actions';
import { topicsLimit } from '@/features/topics/constants';
import { TAvailableTopic } from '@/features/topics/types';

import { AvailableTopicsListItem } from './AvailableTopicsListItem';

const saveScrollHash = getRandomHashString();

interface TMemo {
  loadingFrom?: number;
  isCompletelyLoaded: boolean;
  topics: TAvailableTopic[];
  totalCount: number;
  checkIfScrolledToTheEnd?: () => void;
}

export function AvailableTopicsList(props: TPropsWithClassName) {
  const { className } = props;
  const topicsContext = useTopicsContext();
  const scrollNodeRef = React.useRef<HTMLDivElement>(null);
  const containerNodeRef = React.useRef<HTMLDivElement>(null);
  const { totalCount, topics, setTopics, setTotalCount } = topicsContext;
  const isCompletelyLoaded = topics.length >= totalCount;

  const memo = React.useMemo<TMemo>(
    () => ({ isCompletelyLoaded, totalCount, topics }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const [isLoading, startLoading] = React.useTransition();

  const loadNextData = React.useCallback(() => {
    const prevTopics = memo.topics;
    const startPos = memo.loadingFrom ? memo.loadingFrom + topicsLimit : prevTopics.length;
    if (memo.loadingFrom || startPos >= memo.totalCount) {
      return;
    }
    memo.loadingFrom = startPos;
    startLoading(async () => {
      try {
        const promise = getAvailableTopics({
          showOnlyMyTopics: false,
          skip: startPos,
        });
        toast.promise(promise, {
          loading: 'Loading topics data...',
          success: 'Topics data successfully loaded.',
          error: 'Error loading topics data.',
        });
        const { topics, totalCount } = await promise;
        const topicIds = prevTopics.map(({ id }) => id);
        // DEBUG: Check if there are duplicated records (???)
        const dubbedTopics = topics.filter(({ id }) => topicIds.includes(id));
        if (dubbedTopics.length) {
          // eslint-disable-next-line no-console
          console.warn('[AvailableTopicsList:loadNextData] Duplicated topics has been loaded', {
            topicIds,
            dubbedTopics,
            topics,
            prevTopics,
            totalCount,
            startPos,
            topicsLimit,
            memo,
          });
          debugger; // eslint-disable-line no-debugger
        }
        memo.totalCount = totalCount;
        setTopics((prevTopics) => {
          memo.topics = prevTopics.concat(topics);
          memo.isCompletelyLoaded = memo.topics.length >= totalCount;
          return memo.topics;
        });
        setTotalCount(totalCount);
        if (memo.checkIfScrolledToTheEnd) {
          setTimeout(memo.checkIfScrolledToTheEnd, 100);
        }
        // TODO: Update topics and totalCount, check
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('[ManageTopicQuestionAnswersListCard:handleReload] catch', {
          error,
        });
        debugger; // eslint-disable-line no-debugger
      } finally {
        delete memo.loadingFrom;
      }
    });
  }, [memo, setTopics, setTotalCount]);

  const checkIfScrolledToTheEnd = React.useCallback(() => {
    // Do nothing if all the records has been already loaded, or if that's a server component
    if (memo.isCompletelyLoaded || typeof window === 'undefined') {
      return;
    }
    const scrollNode = scrollNodeRef.current;
    const containerNode = containerNodeRef.current;
    // Do nothing if the nodes haven't been initalized yet
    if (!scrollNode || !containerNode) {
      return;
    }
    const scrollBottom = scrollNode.getBoundingClientRect().bottom;
    const containerBottom = containerNode.getBoundingClientRect().bottom;
    const extraGap = window.innerHeight / 2;
    const scrollIsPossible = containerBottom <= scrollBottom + extraGap;
    if (scrollIsPossible) {
      loadNextData();
    }
  }, [loadNextData, memo, scrollNodeRef, containerNodeRef]);

  React.useEffect(() => {
    // Save self link to re-invoke after data loaded
    memo.checkIfScrolledToTheEnd = checkIfScrolledToTheEnd;
    // Initially check the necessarity of loading the next data
    checkIfScrolledToTheEnd();
    // Set watching event handlers
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', checkIfScrolledToTheEnd);
      window.addEventListener('orientationchange', checkIfScrolledToTheEnd);
      return () => {
        window.removeEventListener('resize', checkIfScrolledToTheEnd);
        window.removeEventListener('orientationchange', checkIfScrolledToTheEnd);
      };
    }
  }, [memo, checkIfScrolledToTheEnd]);

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
        {!isCompletelyLoaded && (
          <div
            className={cn(
              'pointer-events-none flex w-full items-center justify-center p-2 transition',
              !isLoading && 'opacity-0',
            )}
          >
            <Icons.spinner className={cn('size-6', isLoading && 'animate-spin')} />
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
