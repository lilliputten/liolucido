import { MessageContent } from '@langchain/core/messages';
import z from 'zod';

import { safeJsonParse } from '@/lib/helpers/json';
import { AnswerSchema } from '@/generated/prisma';

import { TPlainMessage } from '../types/messages';
import { sendAiTextQuery } from './sendAiTextQuery';

export const generationTypes = [
  // All possible answer types to generation
  'RANDOM',
  'CORRECT',
  'WRONG',
] as const;
const generationTypeQueries = {
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

export const generateQuestionAnswersParamsSchema = z.object({
  generationType: generationTypesSchema,
  topicText: z.string(),
  questionText: z.string(),
  extraText: z.string().optional(),
  answersCountMin: z.coerce.number(),
  answersCountMax: z.coerce.number(),
  debugData: z.boolean().optional(),
});
export type TGenerateQuestionAnswersParams = z.infer<typeof generateQuestionAnswersParamsSchema>;

const generatedAnswerSchema = AnswerSchema.pick({ text: true, isCorrect: true });
export type TGeneratedAnswer = z.infer<typeof generatedAnswerSchema>;
export const generatedAnswersSchema = z.object({
  answers: z.array(generatedAnswerSchema),
});
export type TGeneratedAnswers = z.infer<typeof generatedAnswersSchema>;

function getSystemQueryText(_params: TGenerateQuestionAnswersParams) {
  return [
    'You are an assistant that generates correct or wrong question answers for a given topic in JSON format.',
    'Each answer object should have "text" with answer text (in markdown format) and "isCorrect" boolean properties indicating whether it is a correct answer or not.',
    'The response should be well-formed JSON, and answer texts must use the language of the input question.',
  ].join('\n\n');
}

function getGenerationQuery(params: TGenerateQuestionAnswersParams) {
  const { generationType } = params;
  return generationTypeQueries[generationType];
}

function getUserQueryText(params: TGenerateQuestionAnswersParams) {
  const {
    topicText,
    questionText,
    extraText,
    answersCountMin,
    answersCountMax,
    // createdAt,
    // generationType,
  } = params;
  return [
    'Please provide a JSON response with an "answers" key containing an array of answer objects.',
    'Each answer object should have "text" with answer text (in markdown format) and "isCorrect" boolean properties indicating whether it is a correct answer or not.',
    `Generate a list of ${answersCountMin} to ${answersCountMax} responses.`,
    getGenerationQuery(params),
    extraText,
    'The topic:',
    topicText,
    'The question:',
    questionText,
  ]
    .filter(Boolean)
    .join('\n\n');
}

export async function generateQuestionAnswers(params: TGenerateQuestionAnswersParams) {
  const { debugData } = params;
  const systemQueryText = getSystemQueryText(params);
  const userQueryText = getUserQueryText(params);
  const messages: TPlainMessage[] = [
    { role: 'system', content: systemQueryText },
    { role: 'user', content: userQueryText },
  ];
  const queryResult = await sendAiTextQuery(messages, {
    // clientType,
    debugData,
  });
  const { content } = queryResult;
  const rawText: MessageContent = content;
  if (typeof rawText !== 'string') {
    throw new Error(`Received unexpected result type: ${typeof rawText}`);
  }
  const rawData = safeJsonParse(rawText, undefined);
  const validatedData: TGeneratedAnswers = generatedAnswersSchema.parse(rawData);
  return validatedData;
}
