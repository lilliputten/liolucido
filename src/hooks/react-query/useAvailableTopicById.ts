import React from 'react';
import { QueryKey, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { APIError } from '@/shared/types/api';
import { TAvailableTopicsResultsQueryData } from '@/shared/types/react-query';
import { handleApiResponse } from '@/lib/api';
import { useInvalidateReactQueryKeys } from '@/lib/data';
import { appendUrlQueries, composeUrlQuery } from '@/lib/helpers/urls';
import { TGetAvailableTopicByIdParams } from '@/lib/zod-schemas';
import { minuteMs } from '@/constants';
import { TAvailableTopic } from '@/features/topics/types';

interface TUseAvailableTopicByIdProps extends TGetAvailableTopicByIdParams {
  /** availableTopicsQueryKey - A query key from `useAvailableTopics` */
  availableTopicsQueryKey?: QueryKey;
}

const staleTime = minuteMs * 10;

/** Get topic data from cached `useAvailableTopics` query data or fetch it now */
export function useAvailableTopicById(props: TUseAvailableTopicByIdProps) {
  const queryClient = useQueryClient();
  const invalidateKeys = useInvalidateReactQueryKeys();
  const { availableTopicsQueryKey, id: topicId, ...queryProps } = props;

  /* Use partrial query url as a part of the query key */
  const queryHash = React.useMemo(() => composeUrlQuery(queryProps), [queryProps]);

  const queryKey = React.useMemo<QueryKey>(
    () => ['available-topic', topicId, queryHash],
    [queryHash, topicId],
  );

  // Check cached infinite query data first
  const availableTopicsData: TAvailableTopicsResultsQueryData | undefined =
    availableTopicsQueryKey &&
    queryClient.getQueryData<TAvailableTopicsResultsQueryData>(availableTopicsQueryKey);

  // Try to find the topic in cached infinite pages
  const cachedTopic = availableTopicsData?.pages
    .flatMap((page) => page.items)
    .find((topic) => topic.id === topicId);

  const isCached = !!cachedTopic;

  // Only fetch if the topic is not cached
  const query = useQuery<TAvailableTopic>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey,
    staleTime, // Data validity period
    queryFn: async (_params) => {
      const url = appendUrlQueries(`/api/topics/${topicId}`, queryHash);
      try {
        // OPTION 1: Using route api fetch
        const result = await handleApiResponse<TAvailableTopic>(fetch(url), {
          onInvalidateKeys: invalidateKeys,
          debugDetails: {
            initiator: 'useAvailableTopicById',
            action: 'getAvailableTopicById',
            url,
            queryProps,
            topicId,
          },
        });
        return result.data as TAvailableTopic;
        /* // OPTION 2: Using server function
         * return await getAvailableTopicById({ id: topicId, ...queryProps });
         */
      } catch (error) {
        const details = error instanceof APIError ? error.details : null;
        const message = 'Cannot load topic data';
        // eslint-disable-next-line no-console
        console.error('[useAvailableTopicById:queryFn]', message, {
          details,
          error,
          url,
        });
        // eslint-disable-next-line no-debugger
        debugger;
        toast.error(message);
        throw error;
      }
    },
    enabled: !isCached, // Disable query if already cached
  });

  return {
    topic: cachedTopic ?? query.data,
    isCached,
    queryKey,
    ...query,
  };
}
