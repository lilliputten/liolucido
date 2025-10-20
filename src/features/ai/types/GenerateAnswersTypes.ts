import { AIMessageChunk } from '@langchain/core/messages';
import z from 'zod';

import { AnswerSchema } from '@/generated/prisma';

export type TAITextQueryData = Pick<
  AIMessageChunk,
  | 'content'
  | 'name'
  | 'additional_kwargs'
  | 'response_metadata'
  | 'id'
  | 'tool_calls'
  | 'invalid_tool_calls'
  | 'usage_metadata'
>;

const generatedAnswerSchema = AnswerSchema.pick({ text: true, explanation: true, isCorrect: true });
// const generatedAnswerSchema = z.object({
//   text: z.string().optional(),
//   explanation: z.string().optional(),
//   isCorrect: z.boolean().optional(),
// });
export type TGeneratedAnswer = z.infer<typeof generatedAnswerSchema>;
export const generatedAnswersSchema = z.object({
  answers: z.array(generatedAnswerSchema),
  answersCount: z.number(),
});
export type TGeneratedAnswers = z.infer<typeof generatedAnswersSchema>;

// export type TExistedAnswer = TGeneratedAnswer;

export const generationTypes = [
  // All possible answer types to generation
  'RANDOM',
  'CORRECT',
  'WRONG',
] as const;
export const generationTypeQueries = {
  CORRECT: 'Provide only correct answers.',
  WRONG: 'Provide only wrong answers.',
  RANDOM: 'Provide multiple incorrect answers and at least one correct answer.',
};
export const generationTypeTexts = {
  CORRECT: 'Only correct answers',
  WRONG: 'Only wrong answers',
  RANDOM: 'Multiple answers with at least one correct',
};
const generationTypesSchema = z.enum(generationTypes);
// type TGenerationType = z.infer<typeof generationTypesSchema>;

export const maxExtraTextLength = 30;

export const generateQuestionAnswersParamsSchema = z.object({
  generationType: generationTypesSchema,
  topicText: z.string(),
  topicDescription: z.string().optional(),
  topicKeywords: z.string().optional(),
  existedAnswers: z.array(generatedAnswerSchema).optional(),
  questionText: z.string(),
  extraText: z.string().max(maxExtraTextLength).optional(),
  answersCountMin: z.coerce.number(),
  answersCountMax: z.coerce.number(),
  debugData: z.boolean().optional(),
});
export type TGenerateQuestionAnswersParams = z.infer<typeof generateQuestionAnswersParamsSchema>;
