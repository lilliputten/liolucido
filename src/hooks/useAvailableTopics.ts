'use client';

import { usePathname } from 'next/navigation';
import { InfiniteData, QueryKey, useInfiniteQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { APIError } from '@/shared/types/api';
import { handleApiResponse } from '@/lib/api';
import { useInvalidateReactQueryKeys } from '@/lib/data/invalidateReactQueryKeys';
import { composeUrl } from '@/lib/helpers/urls';
import { minuteMs } from '@/constants';
import { TGetAvailableTopicsResults } from '@/features/topics/actions/getAvailableTopicsSchema';
import { topicsLimit } from '@/features/topics/constants';

const staleTime = minuteMs * 10;

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

export const useAvailableTopics = () => {
  const invalidateKeys = useInvalidateReactQueryKeys();
  const pathname = usePathname();

  const query = useInfiniteQuery<
    TGetAvailableTopicsResults,
    Error,
    InfiniteData<TGetAvailableTopicsResults>,
    QueryKey,
    number // cursor type
  >({
    queryKey: ['topics', 'available'],
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
      const { pageParam = 0 } = params;
      /* // TODO: It's possible to pass other parameters (see `GetAvailableTopicsParamsSchema`):
       * skip: Skip records (start from the nth record), default = 0
       * take: Amount of records to return, default = {topicsLimit}
       * showOnlyMyTopics: Display only current user's topics
       * includeUser: Unclude compact user info data (name, email) in the `user` property of result object
       * includeQuestionsCount: Include related questions count, in `_count: { questions }`
       * orderBy: Sort by parameter, default: `{ createdAt: 'desc' }`, packed json string
       */
      // const url = `/api/topics?skip=${pageParam}&take=${topicsLimit}`;
      const url = composeUrl(
        '/api/topics',
        { skip: pageParam, take: topicsLimit },
        { omitFalsy: true },
      );
      /* console.log('[useAvailableTopics:queryFn] start', {
       *   pageParam,
       *   url,
       * });
       */
      try {
        const result = await handleApiResponse(fetch(url), {
          onInvalidateKeys: invalidateKeys,
          debugDetails: {
            initiator: 'useAvailableTopics',
            action: 'getAvailableTopics',
            pageParam,
          },
        });
        /* console.log('[useAvailableTopics:queryFn] done', {
         *   result,
         *   pageParam,
         *   url,
         * });
         */
        return result.data as TGetAvailableTopicsResults;
      } catch (error) {
        const details = error instanceof APIError ? error.details : null;
        const message = 'Cannot load topics data';
        // eslint-disable-next-line no-console
        console.error('[useAvailableTopics:queryFn]', message, {
          details,
          error,
          pageParam,
          action: 'getAvailableTopics',
          url,
        });
        // eslint-disable-next-line no-debugger
        debugger;
        toast.error(message);
        throw error;
      }
    },
  });

  return {
    ...query,
    routePath: pathname,
  };
};
