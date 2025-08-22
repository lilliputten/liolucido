import { QueryKey, useQuery, useQueryClient } from '@tanstack/react-query';

import { TAvailableTopicsResultsQueryData } from '@/shared/types/react-query';
import { getTopic } from '@/features/topics/actions';
import { TAvailableTopic } from '@/features/topics/types';

// Your custom hook combining the logic
/** Get topic data from cached `useAvailableTopics` query data or fetch it now
 * @param {TTopicId} topicId
 * @param {QueryKey} infiniteQueryKey - A query key from `useAvailableTopics`
 */
export function useAvailableTopicById(topicId: string, infiniteQueryKey?: QueryKey) {
  const queryClient = useQueryClient();

  // Check cached infinite query data first
  const infiniteData =
    infiniteQueryKey &&
    queryClient.getQueryData<TAvailableTopicsResultsQueryData>(infiniteQueryKey);

  // Try to find the topic in cached infinite pages
  const cachedTopic = infiniteData?.pages
    .flatMap((page) => page.topics)
    .find(({ id }) => id === topicId);

  // Only fetch if the topic is not cached
  const query = useQuery<TAvailableTopic>({
    queryKey: ['available-topic', topicId],
    queryFn: (_params) => {
      // TODO: Change to fetchAvailableTopic or to fetch its API route
      return getTopic(topicId);
    }, // Your query function for single topic
    enabled: !cachedTopic, // Disable query if already cached
  });

  return {
    topic: cachedTopic ?? query.data,
    ...query,
  };
}
