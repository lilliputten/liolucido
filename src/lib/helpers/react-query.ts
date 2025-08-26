import { QueryKey } from '@tanstack/react-query';

import { TGetResults, TGetResultsIniniteQueryData } from '@/shared/types/generic/api';
import { TAllUsedKeys, TQueryClient } from '@/shared/types/react-query';

/** Stringify react-query data key (unknown[] -> string) */
export function stringifyQueryKey(qk: QueryKey) {
  // return JSON.stringify(qk);
  return String(qk);
}

/** Extract & deduplicate topics by their IDs */
export function getUnqueItemsList<TItem extends { id: TId }, TId = string>(
  results?: TGetResults<TItem>[],
) {
  if (!results) return [];
  // Deduplicate topics by their ID
  const uniqueTopicsMap = new Set<TId>();
  return results
    .flatMap((page) => page.items)
    .filter(({ id }) => {
      if (!uniqueTopicsMap.has(id)) {
        uniqueTopicsMap.add(id);
        return true;
      }
    });
}

/** Add a new item record to cached pages. */
export function addNewItemToQueryCache<TItem>(
  queryClient: TQueryClient,
  queryKey: QueryKey,
  newTopic: TItem,
  toStart?: boolean,
) {
  return queryClient.setQueryData<TGetResultsIniniteQueryData<TItem>>(queryKey, (oldData) => {
    if (!oldData) return oldData;
    const lastPageIndex = oldData.pages.length - 1;
    let totalCount = 0;
    const pages: TGetResults<TItem>[] = oldData.pages.map((page, index) => {
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

/** Delete an item from cached pages by id. */
export function deleteItemFromQueryCache<TItem extends { id: TId }, TId = string>(
  queryClient: TQueryClient,
  queryKey: QueryKey,
  topicIdToDelete: TId,
) {
  return queryClient.setQueryData<TGetResultsIniniteQueryData<TItem>>(queryKey, (oldData) => {
    if (!oldData) return oldData;
    let totalCount = 0;
    const pages: TGetResults<TItem>[] = oldData.pages.map((page) => {
      const items = page.items.filter((topic) => topic.id !== topicIdToDelete);
      totalCount += items.length;
      return { ...page, items };
    });
    const updatedPages = pages.map((page) => ({ ...page, totalCount }));
    return { ...oldData, pages: updatedPages };
  });
}

/** Update an item in cached pages by id. */
export function updateItemInQueryCache<TItem extends { id: TId }, TId = string>(
  queryClient: TQueryClient,
  queryKey: QueryKey,
  updatedTopic: TItem,
) {
  return queryClient.setQueryData<TGetResultsIniniteQueryData<TItem>>(queryKey, (oldData) => {
    if (!oldData) return oldData;
    const updatedId = updatedTopic.id;
    const pages: TGetResults<TItem>[] = oldData.pages.map((page) => {
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

/** Invalidate all used keys except the provided ones. */
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
