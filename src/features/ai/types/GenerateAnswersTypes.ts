import z from 'zod';

import { AnswerSchema } from '@/generated/prisma';

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

export const answersGenerationTypes = [
  // All possible answer types to generation
  'RANDOM',
  'CORRECT',
  'WRONG',
] as const;
export const answersGenerationTypeQueries = {
  CORRECT: 'Provide only correct answers.',
  WRONG: 'Provide only wrong answers.',
  RANDOM: 'Provide multiple incorrect answers and at least one correct answer.',
};
export const answersGenerationTypeTexts = {
  CORRECT: 'Only correct answers',
  WRONG: 'Only wrong answers',
  RANDOM: 'Multiple answers with at least one correct',
};
const answersGenerationTypesSchema = z.enum(answersGenerationTypes);
export type TAnswerGenerationType = z.infer<typeof answersGenerationTypesSchema>;

export const maxExtraTextLength = 30;

export const generateQuestionAnswersParamsSchema = z.object({
  answersGenerationType: answersGenerationTypesSchema,
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
