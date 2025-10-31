import { truncateMarkdown } from '@/lib/helpers';

import { TGenerateTopicQuestionsParams } from '../types/GenerateQuestionsTypes';
import { TPlainMessage } from '../types/messages';
import { getAnswersGenerationQuery } from './createGenerateQuestionAnswersMessages';

export function createGenerateTopicQuestionsMessages(
  params: TGenerateTopicQuestionsParams,
): TPlainMessage[] {
  const {
    questionsGenerationType,
    questionsCountMin,
    questionsCountMax,
    answersGenerationType,
    answersCountMin,
    answersCountMax,
    extraText,
    topicText,
    topicDescription,
    // topicKeywords,
    existedQuestions,
  } = params;

  // const hasExistedQuestions = !!existedQuestions?.length;
  const existedQuestionsText = existedQuestions?.length
    ? existedQuestions.map(({ text }) => '- ' + truncateMarkdown(text, 200)).join('\n')
    : undefined;

  // const descriptionText = topicDescription ? `\nDescription: ${topicDescription}` : '';
  // const extraInstructions = extraText ? `\n\nAdditional instructions: ${extraText}` : '';

  const generationTypeInstructions = {
    BASIC: 'Generate straightforward, clear questions that test basic understanding.',
    DETAILED: 'Generate comprehensive questions that require detailed knowledge and analysis.',
    MIXED: 'Generate a mix of basic and detailed questions with varying complexity.',
  };

  const answerFieldsText = [
    `- "text" with the answer text in plain text or strict markdown markup (in the same language as the question),`,
    `- "explanation" the reason why this answer is correct or incorrect,`,
    `- "isCorrect" as a boolean indicating if it is the correct answer.`,
  ].join('\n');

  const systemMessage: TPlainMessage = {
    role: 'system',
    content: `You are an expert educational content creator. Generate high-quality questions for a learning topic.

Requirements:
- ${generationTypeInstructions[questionsGenerationType]}
- Questions should be clear, educational, and relevant to the topic.
- Avoid duplicating existing questions (listed below).
- Return ONLY a valid JSON object with a "questions" field containing a list of question objects and "questionsCount" with a number of totally generated questions.
- Each question should be a complete, well-formed question.
- For each question, generate answers in an "answers" field, as a well-formed JSON object with an "answers" field containing a list of answer objects and "answersCount" with a number generated answers.
- ${getAnswersGenerationQuery(answersGenerationType)}

Each answer object must have:

${answerFieldsText}

Example format:
{
  "questionsCount": 1,
  "questions": [
    {
      "text": "What is the main concept of...?",
      "answersCount": 1
      "answers": ["text": "Answer text...", "explanation": "Explanation text", "isCorrect": false],
    },
  ]
}
`,
  };

  const userMessage: TPlainMessage = {
    role: 'user',
    content: [
      `Topic: ${topicText}`,
      topicDescription && `Topic description: ${topicDescription}`,
      `Generate ${questionsCountMin}-${questionsCountMax} questions for this topic, with ${answersCountMin}-${answersCountMax} answers per each question.`,
      extraText && `Additional instructions: ${extraText}`,
      existedQuestionsText && `Existing questions to avoid duplicating:`,
      existedQuestionsText,
    ]
      .filter(Boolean)
      .join('\n\n'),
  };

  return [systemMessage, userMessage];
}
