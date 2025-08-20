'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import {
  InfiniteData,
  QueryClient,
  QueryKey,
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { toast } from 'sonner';

import { APIError } from '@/shared/types/api';
import { handleApiResponse } from '@/lib/api';
import { useInvalidateReactQueryKeys } from '@/lib/data/invalidateReactQueryKeys';
import { appendUrlQueries, composeUrlQuery } from '@/lib/helpers/urls';
import { minuteMs } from '@/constants';
import {
  defaultTopicsManageScope,
  TopicsManageScopeIds,
  TTopicsManageScopeId,
} from '@/contexts/TopicsContext';
import {
  TGetAvailableTopicsParams,
  TGetAvailableTopicsResults,
} from '@/features/topics/actions/getAvailableTopicsSchema';
import { topicsLimit } from '@/features/topics/constants';
import { TTopic } from '@/features/topics/types';

import { useSessionUser } from './useSessionUser';

const staleTime = minuteMs * 10;

// TODO: Register all the query keys

/** Extract & deduplicate topics by their IDs */
export function getUnqueTopicsList(results?: TGetAvailableTopicsResults[]) {
  if (!results) return [];
  // Deduplicate topics by their ID
  const uniqueTopicsMap = new Set<string>();
  return results
    .flatMap((page) => page.topics)
    .filter(({ id }) => {
      if (!uniqueTopicsMap.has(id)) {
        uniqueTopicsMap.add(id);
        return true;
      }
    });
}

type TUseAvailableTopicsProps = Omit<TGetAvailableTopicsParams, 'skip' | 'take'>;

/** Collection of the all used query keys (mb, already invalidated).
 *
 * TODO:
 * - To use `QueryCache.subscribe` to remove invalidated keys?
 * - Create a helper to invalidate all the keys or all the keys, except current?
 */
const allUsedKeys: Record<string, QueryKey> = {};

export function stringifyQueryKey(qk: QueryKey) {
  // return JSON.stringify(qk);
  return String(qk);
}

/*
export function addNewAvailableTopic(
  queryClient: QueryClient,
  queryKey: QueryKey,
  newTopic: TTopic,
  toStart?: boolean,
) {
  queryClient.setQueryData<InfiniteData<TGetAvailableTopicsResults, unknown>>(
    queryKey,
    (oldData) => {
      if (!oldData) return oldData;
      // Append to the end of the last page's topics
      const lastPageIndex = oldData.pages.length - 1;
      const pages: TGetAvailableTopicsResults[] = oldData.pages.map((page, index) => {
        if (toStart && !index) {
          // Add to the beginning of the first page's topics
          return { ...page, topics: [newTopic, ...page.topics] };
        } else if (!toStart && index === lastPageIndex) {
          // Add to the end
          return { ...page, topics: [...page.topics, newTopic] };
        }
        return page;
      });
      return { ...oldData, pages };
    },
  );
}
*/

export function addNewAvailableTopic(
  queryClient: QueryClient,
  queryKey: QueryKey,
  newTopic: TTopic,
  /** Add the new item to the beginning of the existing items */
  toStart?: boolean,
) {
  queryClient.setQueryData<InfiniteData<TGetAvailableTopicsResults, unknown>>(
    queryKey,
    (oldData) => {
      if (!oldData) return oldData;
      const lastPageIndex = oldData.pages.length - 1;
      let totalCount = 0;
      const pages: TGetAvailableTopicsResults[] = oldData.pages.map((page, index) => {
        if (toStart && index === 0) {
          // Add to the beginning of the first page's topics
          page = { ...page, topics: [newTopic, ...page.topics] };
        } else if (!toStart && index === lastPageIndex) {
          // Add to the end of the last page's topics
          page = { ...page, topics: [...page.topics, newTopic] };
        }
        totalCount += page.topics.length;
        return page;
      });
      // Update totalCount for the all pages...
      const updatedPages = pages.map((page) => ({ ...page, totalCount }));
      return { ...oldData, pages: updatedPages };
    },
  );
}

export function invalidateAllUsedKeysExcept(queryClient: QueryClient, excludeKey: QueryKey) {
  queryClient.invalidateQueries({
    predicate: (query) => {
      // Exclude queries matching the excludeKey exactly
      // React Query stores query keys as arrays internally
      const queryKeyStr = JSON.stringify(query.queryKey);
      const excludeKeyStr = JSON.stringify(excludeKey);
      return (
        queryKeyStr !== excludeKeyStr &&
        Object.values(allUsedKeys).some((key) => {
          return JSON.stringify(key) === queryKeyStr;
        })
      );
    },
  });
}

export function useAvailableTopics(queryProps: TUseAvailableTopicsProps = {}) {
  const invalidateKeys = useInvalidateReactQueryKeys();
  const pathname = usePathname();

  /* Use partrial query url as a part of the query key */
  const queryHash = React.useMemo(
    () => composeUrlQuery(queryProps, { omitFalsy: true }),
    [queryProps],
  );
  // const queryKey = React.useMemo<QueryKey>(() => ['topics', 'available', queryHash], [queryHash]);
  const queryKey: QueryKey = ['available-topics', queryHash];
  allUsedKeys[stringifyQueryKey(queryKey)] = queryKey;

  const query: UseInfiniteQueryResult<
    InfiniteData<TGetAvailableTopicsResults, unknown>,
    Error
  > = useInfiniteQuery<
    TGetAvailableTopicsResults,
    Error,
    InfiniteData<TGetAvailableTopicsResults>,
    QueryKey,
    number // Cursor type (from `skip` api parameter)
  >({
    queryKey,
    staleTime, // Data validity period
    // gcTime: 10 * staleTime, // Inactive cache validity period
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      /* // Take only unique topics (it cause permanent 'more items available' if some topics has been loaded twice)
       * const loadedCount = getUnqueTopicsList(allPages).length;
       */
      // A naive solution
      const loadedCount = allPages.reduce((acc, page) => acc + page.topics.length, 0);
      return loadedCount < lastPage.totalCount ? loadedCount : undefined;
    },
    queryFn: async (params) => {
      /* // DEBUG: Test error
       * throw new Error('Test error');
       */
      const { pageParam = 0 } = params;
      const paginationHash = composeUrlQuery(
        { skip: pageParam, take: topicsLimit },
        { omitFalsy: true },
      );
      const url = appendUrlQueries('/api/topics', queryHash, paginationHash);
      try {
        const result = await handleApiResponse(fetch(url), {
          onInvalidateKeys: invalidateKeys,
          debugDetails: {
            initiator: 'useAvailableTopics',
            action: 'getAvailableTopics',
            pageParam,
          },
        });
        return result.data as TGetAvailableTopicsResults;
      } catch (error) {
        const details = error instanceof APIError ? error.details : null;
        const message = 'Cannot load topics data';
        // eslint-disable-next-line no-console
        console.error('[useAvailableTopics:queryFn]', message, {
          details,
          error,
          pageParam,
          url,
        });
        // eslint-disable-next-line no-debugger
        debugger;
        toast.error(message);
        throw error;
      }
    },
  });

  /* // List of query properties:
   * status
   * error
   * data
   * isLoading
   * isError
   * isPending
   * isLoadingError
   * isRefetchError
   * isSuccess
   * isPlaceholderData
   * fetchNextPage
   * fetchPreviousPage
   * hasNextPage
   * hasPreviousPage
   * isFetchNextPageError
   * isFetchingNextPage
   * isFetchPreviousPageError
   * isFetchingPreviousPage
   * dataUpdatedAt
   * errorUpdatedAt
   * failureCount
   * failureReason
   * errorUpdateCount
   * isFetched
   * isFetchedAfterMount
   * isFetching
   * isInitialLoading
   * isPaused
   * isRefetching
   * isStale
   * isEnabled
   * refetch
   * fetchStatus
   * promise
   */

  const allTopics = React.useMemo(() => getUnqueTopicsList(query.data?.pages), [query.data?.pages]);

  return {
    ...query,
    queryKey,
    allUsedKeys,
    allTopics,
    hasTopics: !!allTopics.length, // !!query.data?.pages[0]?.totalCount,
    routePath: pathname,
  };
}

interface TUseAvailableTopicsByScopeProps {
  manageScope?: TTopicsManageScopeId;
}

export function useAvailableTopicsByScope(props: TUseAvailableTopicsByScopeProps = {}) {
  const {
    manageScope = defaultTopicsManageScope,
    // user,
  } = props;
  const user = useSessionUser();
  const queryProps: TUseAvailableTopicsProps = React.useMemo(() => {
    const isAdmin = user?.role === 'ADMIN';
    return {
      // skip, // Skip records (start from the nth record), default = 0 // z.number().int().nonnegative().optional()
      // take, // Amount of records to return, default = {topicsLimit} // z.number().int().positive().optional()
      adminMode: manageScope === TopicsManageScopeIds.ALL_TOPICS && isAdmin, // Get all users' data not only your own (admins only: will return no data for non-admins) ??? // z.boolean().optional()
      showOnlyMyTopics: manageScope === TopicsManageScopeIds.MY_TOPICS, // Display only current user's topics // z.boolean().optional()
      includeWorkout: true, // Include (limited) workout data // z.boolean().optional()
      includeUser: true, // Include compact user info data (name, email) in the `user` property of result object // z.boolean().optional()
      includeQuestionsCount: true, // Include related questions count, in `_count: { questions }` // z.boolean().optional()
      orderBy: { updatedAt: 'desc' }, // Sort by parameter, default: `{ createdAt: 'desc' }`, packed json string // TopicFindManyArgsSchema.shape.orderBy // This approach doesn't work
      // topicIds, // Include only listed topic ids // z.array(z.string()).optional()
    } satisfies TUseAvailableTopicsProps;
  }, [manageScope, user]);
  return useAvailableTopics(queryProps);
}
