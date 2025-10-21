import * as z from 'zod';

import { QuestionSchema } from '@/generated/prisma';

import { answersGenerationTypes, generatedAnswersSchema } from './GenerateAnswersTypes';

const existedQuestionSchema = QuestionSchema.pick({ text: true });
const generatedQuestionSchema = QuestionSchema.pick({ text: true }).extend(
  generatedAnswersSchema.shape,
);
export type TGeneratedQuestion = z.infer<typeof generatedQuestionSchema>;
export const generatedQuestionsSchema = z.object({
  questions: z.array(generatedQuestionSchema),
  questionsCount: z.number(),
});
export type TGeneratedQuestions = z.infer<typeof generatedQuestionsSchema>;

export const questionsGenerationTypes = [
  // All possible question types to generation
  'BASIC',
  'DETAILED',
  'MIXED',
] as const;
export type TQuestionsGenerationType = (typeof questionsGenerationTypes)[number];

export const questionsGenerationTypeTexts: Record<TQuestionsGenerationType, string> = {
  BASIC: 'Basic Questions',
  DETAILED: 'Detailed Questions',
  MIXED: 'Mixed Questions',
};

export const generateTopicQuestionsParamsSchema = z.object({
  debugData: z.boolean().optional(),
  questionsGenerationType: z.enum(questionsGenerationTypes),
  questionsCountMin: z.number().min(1).max(50),
  questionsCountMax: z.number().min(1).max(50),
  answersGenerationType: z.enum(answersGenerationTypes),
  answersCountMin: z.number().min(1).max(20),
  answersCountMax: z.number().min(1).max(20),
  extraText: z.string().optional(),
  topicText: z.string(),
  topicDescription: z.string().optional(),
  topicKeywords: z.string().optional(),
  existedQuestions: z.array(existedQuestionSchema).optional(),
});

export type TGenerateTopicQuestionsParams = z.infer<typeof generateTopicQuestionsParamsSchema>;
