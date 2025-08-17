import { z } from 'zod';

import { TopicOrderByWithRelationInputSchema } from '@/generated/prisma';

import { TAvailableTopic } from '../types';

export const zTopicOrderBy = z
  .union([TopicOrderByWithRelationInputSchema.array(), TopicOrderByWithRelationInputSchema])
  .optional();
export type TTopicOrderBy = z.infer<typeof zTopicOrderBy>;

export const GetAvailableTopicsParamsSchema = z.object({
  /** Skip records (start from the nth record), default = 0 */
  skip: z.number().int().nonnegative().optional(),
  /** Amount of records to return, default = {topicsLimit} */
  take: z.number().int().positive().optional(),
  /** Display only current user's topics */
  showOnlyMyTopics: z.boolean().optional(),
  /** Unclude compact user info data (name, email) in the `user` property of result object */
  includeUser: z.boolean().optional(),
  /** Include related questions count, in `_count: { questions }` */
  includeQuestionsCount: z.boolean().optional(),
  /** Sort by parameter, default: `{ createdAt: 'desc' }`, packed json string */
  // orderBy: TopicFindManyArgsSchema.shape.orderBy, // This approach doesn't work
  orderBy: zTopicOrderBy,
});

export type TGetAvailableTopicsParams = z.infer<typeof GetAvailableTopicsParamsSchema>;
// type TOrderBy = TGetAvailableTopicsParams['orderBy'];
// // Explicit schema creation
// interface TGetAvailableTopicsParams {
//   [>* Skip records (start from the nth record), default = 0 <]
//   skip?: number;
//   [>* Amount of records to return, default = {topicsLimit} <]
//   take?: number;
//   [>* Display only current user's topics <]
//   showOnlyMyTopics?: boolean;
//   [>* Unclude compact user info data (name, email) in the `user` property of result object <]
//   includeUser?: boolean;
//   [>* Include related questions count, in `_count: { questions }` <]
//   includeQuestionsCount?: boolean;
//   [>* Sort by parameter, default: `{ createdAt: 'desc' }` <]
//   orderBy?: Prisma.TopicFindManyArgs['orderBy'];
// }

export interface TGetAvailableTopicsResults {
  topics: TAvailableTopic[];
  /** Total records count for these conditions */
  totalCount: number;
}
