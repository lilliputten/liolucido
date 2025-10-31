import { QueryKey, useQuery } from '@tanstack/react-query';

import { TAllUsedKeys } from '@/lib/types/react-query';
import { stringifyQueryKey } from '@/lib/helpers/react-query';
import { getAvailableQuestionsIdsForTopicId } from '@/features/questions/actions/getAvailableQuestionsIdsForTopicId';
import { TTopicId } from '@/features/topics/types';

const allUsedKeys: TAllUsedKeys = {};

export function useQuestionIdsForTopicId({ topicId }: { topicId?: TTopicId }) {
  const queryKey: QueryKey = ['available-questions-ids-for-topic', topicId];
  allUsedKeys[stringifyQueryKey(queryKey)] = queryKey;

  const query = useQuery({
    queryKey,
    queryFn: () => (topicId ? getAvailableQuestionsIdsForTopicId(topicId) : Promise.resolve([])),
    enabled: !!topicId,
  });

  return {
    ...query,
    questionIds: query.data,
    queryKey,
    allUsedKeys,
  };
}
