import { truncateString } from '@/lib/helpers';

import {
  answersGenerationTypeQueries,
  maxExtraTextLength,
  TAnswerGenerationType,
  TGenerateQuestionAnswersParams,
} from '../types/GenerateAnswersTypes';
import { TPlainMessage } from '../types/messages';

/* // UNUSED: Temporarily
 * function getSystemQueryText(_params: TGenerateQuestionAnswersParams) {
 *   return [
 *     'You are an assistant that generates correct or wrong question answers for a given topic in JSON format.',
 *     'Each answer object should have "text" with answer text (in markdown format) and "isCorrect" boolean properties indicating whether it is a correct answer or not.',
 *     'The response should be well-formed JSON, and answer texts must use the language of the input topic and the input question.',
 *   ].join('\n\n');
 * }
 */

export function getAnswersGenerationQuery(answersGenerationType: TAnswerGenerationType) {
  return answersGenerationTypeQueries[answersGenerationType];
}

function getUserQueryText(params: TGenerateQuestionAnswersParams) {
  const {
    // topicDescription,
    questionText,
    topicText,
    // topicKeywords,
    extraText,
    existedAnswers,
    answersCountMin,
    answersCountMax,
    // createdAt,
    answersGenerationType,
  } = params;
  // const topicDescriptionStr = topicDescription?.trim();
  // const topicKeywordsStr = topicKeywords?.trim();
  const topicTextStr = topicText?.trim();
  const extraTextStr = truncateString(extraText, maxExtraTextLength);
  // const existedAnswersJson = existedAnswers?.length ? JSON.stringify(existedAnswers) : undefined;
  const existedAnswersText = existedAnswers?.map(({ text }) => '- ' + text).join('\n');
  const answerFieldsText = [
    `- "text" with the answer text in plain text or strict markdown markup (in the same language as the question),`,
    `- "explanation" the reason why this answer is correct or incorrect,`,
    `- "isCorrect" as a boolean indicating if it is the correct answer.`,
  ].join('\n');
  return [
    `Generate a list of between ${answersCountMin} and ${answersCountMax} answers to the following question`,
    existedAnswersText &&
      `These answers should exclude previously generated responses (listed below).`,

    getAnswersGenerationQuery(answersGenerationType),

    `Provide the result as a well-formed JSON object with an "answers" field containing a list of answer objects and "answersCount" with a number of totally generated answers.`,

    `Each answer object must have:`,
    answerFieldsText,

    questionText && `Question: ${questionText}`,

    topicTextStr && `This question and the answers are part of a common topic: ${topicTextStr}`,

    extraTextStr,

    `Do not include any other text.`,
    `Make sure that the JSON is formed correctly.`,

    // 'Please provide a JSON response with an "answers" key containing an array of answer objects.',
    // 'Each answer object should have "text" with answer text (in markdown format) and "isCorrect" boolean properties indicating whether it is a correct answer or not.',
    // `Generate a list of ${answersCountMin} to ${answersCountMax} responses.`,
    // `The topic title is: ${topicText}`,
    // topicDescriptionStr && `The topic description is: ${topicDescriptionStr}`,
    // topicKeywordsStr && `The topic keywords are: ${topicKeywordsStr}`,
    // 'The question:',
    // questionText,

    existedAnswersText && `Excluded answers:`,
    existedAnswersText,
  ]
    .filter(Boolean)
    .join('\n\n');
}

export function createGenerateQuestionAnswersMessages(params: TGenerateQuestionAnswersParams) {
  const messages: TPlainMessage[] = [
    // { role: 'system', content: getSystemQueryText(params) },
    { role: 'user', content: getUserQueryText(params) },
  ];
  return messages;
}
