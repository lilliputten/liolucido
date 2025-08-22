import { z } from 'zod';

import { TopicOrderByWithRelationInputSchema } from '@/generated/prisma';

import { TAvailableTopic } from '../types';
import { TopicIncludeParamsSchema } from './getAvailableTopicByIdSchema';

export const zTopicTopicIds = z.array(z.string()).optional();
export type TTopicTopicIds = z.infer<typeof zTopicTopicIds>;

export const zTopicOrderBy = z
  .union([TopicOrderByWithRelationInputSchema.array(), TopicOrderByWithRelationInputSchema])
  .optional();
export type TTopicOrderBy = z.infer<typeof zTopicOrderBy>;

// TODO: Move to zod schemas?
export const GetAvailableTopicsParamsSchema = TopicIncludeParamsSchema.extend({
  /** Skip records (start from the nth record), default = 0 */
  skip: z.coerce.number().int().nonnegative().optional(),
  /** Amount of records to return, default = {topicsLimit} */
  take: z.coerce.number().int().positive().optional(),
  /** Get all users' data not only your own (admins only: will return no data for non-admins) ??? */
  adminMode: z.coerce.boolean().optional(),
  /** Display only current user's topics */
  showOnlyMyTopics: z.coerce.boolean().optional(),
  /* // These parameter come from `TopicIncludeParamsSchema`
   * [>* Include (limited) workout data <]
   * includeWorkout: z.coerce.boolean().optional(),
   * [>* Include compact user info data (name, email) in the `user` property of result object <]
   * includeUser: z.coerce.boolean().optional(),
   * [>* Include related questions count, in `_count: { questions }` <]
   * includeQuestionsCount: z.coerce.boolean().optional(),
   */
  /** Sort by parameter, default: `{ createdAt: 'desc' }`, packed json string */
  // orderBy: TopicFindManyArgsSchema.shape.orderBy, // This approach doesn't work
  orderBy: zTopicOrderBy,
  /** Include only listed topic ids */
  topicIds: zTopicTopicIds, // z.array(z.string()).optional(),
});

export type TGetAvailableTopicsParams = z.infer<typeof GetAvailableTopicsParamsSchema>;

export interface TGetAvailableTopicsResults {
  topics: TAvailableTopic[];
  /** Total records count for these conditions */
  totalCount: number;
}
