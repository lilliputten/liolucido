import { MessageContent } from '@langchain/core/messages';

import { getErrorText } from '@/lib/helpers';

import {
  generatedQuestionsSchema,
  TGeneratedQuestion,
  TGeneratedQuestions,
} from '../types/GenerateQuestionsTypes';
import { TAITextQueryData } from '../types/TAITextQueryData';

export function parseGeneratedTopicQuestions(queryData: TAITextQueryData): TGeneratedQuestion[] {
  let rawJson: MessageContent | undefined;
  let rawData: unknown;

  try {
    const { content } = queryData;
    rawJson = content;
    console.log('[parseGeneratedTopicQuestions] Got raw text', {
      rawJson,
      queryData,
    });
    if (typeof rawJson !== 'string') {
      throw new Error(`Received unexpected result type instead of json string: ${typeof rawJson}`);
    }
    rawJson = rawJson.trim();
    // NOTE: Cloudflare might return this: ```json\n{...}\n```
    const mdStart = '```json';
    const mdEnd = '```';
    if (rawJson.startsWith(mdStart) && rawJson.endsWith(mdEnd)) {
      rawJson = rawJson.substring(mdStart.length, rawJson.length - mdEnd.length).trim();
    }
    rawData = JSON.parse(rawJson);
    console.log('[parseGeneratedTopicQuestions] Parsed raw data', {
      rawData,
      rawJson,
      queryData,
    });
    if (!rawData) {
      throw new Error('Got an invalid (empty) json object');
    }
    const validatedData: TGeneratedQuestions = generatedQuestionsSchema.parse(rawData);
    // DEBUG
    console.log('[parseGeneratedTopicQuestions] Parsed validated data', {
      validatedData,
      rawData,
      rawJson,
      queryData,
    });
    return validatedData.questions;
  } catch (error) {
    const humanMsg = 'Can not parse generated topic questions';
    const errMsg = [humanMsg, getErrorText(error)].filter(Boolean).join(': ');
    // eslint-disable-next-line no-console
    console.error('[parseGeneratedTopicQuestions] ❌', errMsg, {
      error,
      rawJson,
      rawData,
      queryData,
    });
    debugger; // eslint-disable-line no-debugger
    throw new Error(humanMsg);
  }
}
