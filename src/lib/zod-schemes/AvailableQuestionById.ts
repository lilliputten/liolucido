import { z } from 'zod';

// TODO: Move to zod schemas?
export const QuestionIncludeParamsSchema = z.object({
  /** Include related answers count, in `_count: { answers }` */
  includeAnswersCount: z.coerce.boolean().optional(),
});

export type TQuestionIncludeParams = z.infer<typeof QuestionIncludeParamsSchema>;

export const GetAvailableQuestionByIdParamsSchema = QuestionIncludeParamsSchema.extend({
  id: z.coerce.string(), // TQuestionId
});

export type TGetAvailableQuestionByIdParams = z.infer<typeof GetAvailableQuestionByIdParamsSchema>;
