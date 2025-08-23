import { QueryKey } from '@tanstack/react-query';

import {
  TAllUsedKeys,
  TAvailableTopicsResultsQueryData,
  TQueryClient,
} from '@/shared/types/react-query';
import { TGetAvailableTopicsResults } from '@/lib/zod-schemes';
import { TAvailableTopic, TTopicId } from '@/features/topics/types';

export function stringifyQueryKey(qk: QueryKey) {
  // return JSON.stringify(qk);
  return String(qk);
}

/**
 * Add a new topic record to cached pages.
 */
export function addNewTopicToCache(
  queryClient: TQueryClient,
  queryKey: QueryKey,
  newTopic: TAvailableTopic,
  toStart?: boolean,
) {
  queryClient.setQueryData<TAvailableTopicsResultsQueryData>(queryKey, (oldData) => {
    if (!oldData) return oldData;
    const lastPageIndex = oldData.pages.length - 1;
    let totalCount = 0;
    const pages: TGetAvailableTopicsResults[] = oldData.pages.map((page, index) => {
      if (toStart && index === 0) {
        page = { ...page, items: [newTopic, ...page.items] };
      } else if (!toStart && index === lastPageIndex) {
        page = { ...page, items: [...page.items, newTopic] };
      }
      totalCount += page.items.length;
      return page;
    });
    const updatedPages = pages.map((page) => ({ ...page, totalCount }));
    return { ...oldData, pages: updatedPages };
  });
}

/**
 * Delete a topic from cached pages by id.
 */
export function deleteTopicFromCache(
  queryClient: TQueryClient,
  queryKey: QueryKey,
  topicIdToDelete: TTopicId,
) {
  queryClient.setQueryData<TAvailableTopicsResultsQueryData>(queryKey, (oldData) => {
    if (!oldData) return oldData;
    let totalCount = 0;
    const pages: TGetAvailableTopicsResults[] = oldData.pages.map((page) => {
      const items = page.items.filter((topic) => topic.id !== topicIdToDelete);
      totalCount += items.length;
      return { ...page, items };
    });
    const updatedPages = pages.map((page) => ({ ...page, totalCount }));
    return { ...oldData, pages: updatedPages };
  });
}

/**
 * Update a topic in cached pages by id.
 */
export function updateTopicInCache(
  queryClient: TQueryClient,
  queryKey: QueryKey,
  updatedTopic: TAvailableTopic,
) {
  queryClient.setQueryData<TAvailableTopicsResultsQueryData>(queryKey, (oldData) => {
    if (!oldData) return oldData;
    const updatedId = updatedTopic.id;
    const pages: TGetAvailableTopicsResults[] = oldData.pages.map((page) => {
      if (!page.items.find(({ id }) => id === updatedId)) {
        return page;
      }
      const items = page.items.map((topic) =>
        topic.id === updatedTopic.id ? updatedTopic : topic,
      );
      return { ...page, items };
    });
    return { ...oldData, pages };
  });
}

/**
 * Invalidate all used keys except the provided ones.
 */
export function invalidateAllUsedKeysExcept(
  queryClient: TQueryClient,
  excludeKeys?: QueryKey[],
  allUsedKeys?: TAllUsedKeys,
) {
  const excludeKeysStr =
    Array.isArray(excludeKeys) && excludeKeys.length ? excludeKeys.map(stringifyQueryKey) : [];
  queryClient.invalidateQueries({
    predicate: (query) => {
      const queryKeyStr = JSON.stringify(query.queryKey);
      return (
        !excludeKeysStr.includes(queryKeyStr) &&
        (!allUsedKeys ||
          Object.values(allUsedKeys).some((key) => stringifyQueryKey(key) === queryKeyStr))
      );
    },
  });
}
