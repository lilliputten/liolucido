import { TGetAvailableTopicsResults } from '@/lib/zod-schemes';

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
