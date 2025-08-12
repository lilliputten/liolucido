import { ExtendNullWithUndefined, ReplaceNullWithUndefined } from '@/lib/ts';
import { Topic, User } from '@/generated/prisma';

export type TTopic = ExtendNullWithUndefined<Topic> & { _count?: { questions: number } };
export type TTopicReal = ReplaceNullWithUndefined<TTopic>;

export type TTopicId = TTopic['id'];

/** Extended topic, includes some user data */
export type TAvailableTopic = TTopic & { user?: Pick<User, 'id' | 'name' | 'email'> };

/** New topic shouldn't contain id */
/*
 * export type TTopicWithoutId = Omit<TTopic, 'id'>;
 * export type TTopicWithoutUserId = Omit<TTopic, 'userId'>;
 * export type TTopicWithoutIds = Omit<TTopic, 'id' | 'userId'>;
 */

export type TOptionalTopic = Partial<TTopic>;
export type TNewTopic = Partial<Topic> & Pick<Topic, 'name'>; // TTopicWithoutIds; // { name: TTopic['name']; parentId: TTopic['parentId'] };

/*
 * export type TNewOrExistingTopic = TNewTopic & { id?: TTopic['id'] };
 * export type TTopicWithChildren = TTopic & { children: TTopic[] };
 * export type TTopicWithChildrenCount = TTopic & { _count: { children: number } };
 * export type TTopicWithChildrenOrCount = TTopic & { children?: TTopic[] } & {
 *   _count?: { children: number };
 * };
 */
