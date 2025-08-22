import React from 'react';
import { QueryKey, useQuery, useQueryClient } from '@tanstack/react-query';

import { TAvailableTopicsResultsQueryData } from '@/shared/types/react-query';
import { composeUrlQuery } from '@/lib/helpers/urls';
import { minuteMs } from '@/constants';
import { getAvailableTopicById } from '@/features/topics/actions/getAvailableTopicById';
import { TGetAvailableTopicByIdParams } from '@/features/topics/actions/getAvailableTopicByIdSchema';
import { TAvailableTopic } from '@/features/topics/types';

interface TUseAvailableTopicByIdProps extends TGetAvailableTopicByIdParams {
  /** availableTopicsQueryKey - A query key from `useAvailableTopics` */
  availableTopicsQueryKey?: QueryKey;
}

const staleTime = minuteMs * 10;

/** Get topic data from cached `useAvailableTopics` query data or fetch it now */
export function useAvailableTopicById(props: TUseAvailableTopicByIdProps) {
  const { availableTopicsQueryKey, id: topicId, ...queryProps } = props;
  const queryClient = useQueryClient();

  /* Use partrial query url as a part of the query key */
  const queryHash = React.useMemo(
    () => composeUrlQuery(queryProps, { omitFalsy: true }),
    [queryProps],
  );

  const queryKey = React.useMemo<QueryKey>(
    () => ['available-topic', topicId, queryHash],
    [queryHash, topicId],
  );

  // Check cached infinite query data first
  const infiniteData =
    availableTopicsQueryKey &&
    queryClient.getQueryData<TAvailableTopicsResultsQueryData>(availableTopicsQueryKey);

  // Try to find the topic in cached infinite pages
  const cachedTopic = infiniteData?.pages
    .flatMap((page) => page.topics)
    .find((topic) => topic.id === topicId);

  console.log('[useAvailableTopicById]', {
    topicId,
    availableTopicsQueryKey,
    queryProps,
    queryHash,
    queryKey,
    infiniteData,
    cachedTopic,
  });

  // Only fetch if the topic is not cached
  const query = useQuery<TAvailableTopic>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey,
    staleTime, // Data validity period
    queryFn: async (_params) => {
      return await getAvailableTopicById({ id: topicId, ...queryProps });
    },
    enabled: !cachedTopic, // Disable query if already cached
  });

  return {
    topic: cachedTopic ?? query.data,
    queryKey,
    ...query,
  };
}
