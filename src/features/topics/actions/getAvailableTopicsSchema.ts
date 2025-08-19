import { z } from 'zod';

import { TopicOrderByWithRelationInputSchema } from '@/generated/prisma';

import { TAvailableTopic } from '../types';

export const zTopicOrderBy = z
  .union([TopicOrderByWithRelationInputSchema.array(), TopicOrderByWithRelationInputSchema])
  .optional();
export type TTopicOrderBy = z.infer<typeof zTopicOrderBy>;

export const GetAvailableTopicsParamsSchema = z.object({
  /** Skip records (start from the nth record), default = 0 */
  skip: z.coerce.number().int().nonnegative().optional(),
  /** Amount of records to return, default = {topicsLimit} */
  take: z.coerce.number().int().positive().optional(),
  /** Include only listed topic ids */
  topicIds: z.array(z.string()).optional(),
  /** Get all users' data not only your own (admins only: will return no data for non-admins) ??? */
  adminMode: z.coerce.boolean().optional(),
  /** Display only current user's topics */
  showOnlyMyTopics: z.coerce.boolean().optional(),
  /** Include compact user info data (name, email) in the `user` property of result object */
  includeSortWorkouts: z.coerce.boolean().optional(),
  /** Include compact user info data (name, email) in the `user` property of result object */
  includeUser: z.coerce.boolean().optional(),
  /** Include related questions count, in `_count: { questions }` */
  includeQuestionsCount: z.coerce.boolean().optional(),
  /** Sort by parameter, default: `{ createdAt: 'desc' }`, packed json string */
  // orderBy: TopicFindManyArgsSchema.shape.orderBy, // This approach doesn't work
  orderBy: zTopicOrderBy,
});

export type TGetAvailableTopicsParams = z.infer<typeof GetAvailableTopicsParamsSchema>;

export interface TGetAvailableTopicsResults {
  topics: TAvailableTopic[];
  /** Total records count for these conditions */
  totalCount: number;
}
