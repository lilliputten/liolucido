import { z } from 'zod';

export const AnswerIncludeParamsSchema = z.object({
  /** Include topic data */
  includeQuestion: z.coerce.boolean().optional(),
});

export type TAnswerIncludeParams = z.infer<typeof AnswerIncludeParamsSchema>;

export const GetAvailableAnswerByIdParamsSchema = AnswerIncludeParamsSchema.extend({
  id: z.coerce.string(), // TAnswerId
});

export type TGetAvailableAnswerByIdParams = z.infer<typeof GetAvailableAnswerByIdParamsSchema>;
