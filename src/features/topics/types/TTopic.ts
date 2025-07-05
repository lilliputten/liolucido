import { Topic } from '@prisma/client';

export type TTopic = Topic;

export type TTopicId = TTopic['id'];

/** A parent topic id for search.
 * - Numeric value: for any non-root topics with this specific parent.
 * - `null`: for root topics only.
 * - `undefined`: for all available topics.
 */
export type TFetchParentId = TTopicId | null | undefined;

/** New topic shouldn't contain id */
export type TTopicWithoutId = Omit<TTopic, 'id'>;
export type TTopicWithoutUserId = Omit<TTopic, 'userId'>;
export type TTopicWithoutIds = Omit<TTopic, 'id' | 'userId'>;
export type TNewTopic = TTopicWithoutIds; // { name: TTopic['name']; parentId: TTopic['parentId'] };
export type TNewOrExistingTopic = TNewTopic & { id?: TTopic['id'] };

export type TTopicWithChildren = TTopic & { children: TTopic[] };
export type TTopicWithChildrenCount = TTopic & { _count: { children: number } };
export type TTopicWithChildrenOrCount = TTopic & { children?: TTopic[] } & {
  _count?: { children: number };
};
