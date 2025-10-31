'use server';

import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { GigaChatCallOptions } from 'langchain-gigachat';

import { getAiClient } from '@/lib/ai/getAiClient';
import { defaultAiClientType } from '@/lib/ai/types/TAiClientType';

import { TPlainMessage } from '../types/messages';
import { TAIQueryOptions } from '../types/TAIQueryOptions';
import { TAITextQueryData } from '../types/TAITextQueryData';

type TGenericMessage = HumanMessage | SystemMessage;

const debugDataPrefix = './';
const defaultDebugData = 'sample-data/GenerateQuestions/questions-query-data-01.json';

export async function sendAiTextQuery(messages: TPlainMessage[], opts: TAIQueryOptions = {}) {
  const { clientType = defaultAiClientType, debugData } = opts;
  try {
    if (debugData) {
      await new Promise((r) => setTimeout(r, 1000));
      const sampleJsonFile =
        debugDataPrefix + (typeof debugData === 'string' ? debugData : defaultDebugData);
      const rawData = await import(sampleJsonFile);
      const data = { ...rawData.default } as TAITextQueryData;
      return data;
    }
    const prepartedMessages: TGenericMessage[] = messages.map(({ role: type, content: text }) => {
      if (type === 'system') {
        return new SystemMessage(text);
      }
      return new HumanMessage(text);
    });
    const client = await getAiClient(clientType);
    const options = {
      model: client.model,
    } satisfies GigaChatCallOptions;
    const res = await client.invoke(prepartedMessages, options);
    const {
      content,
      name,
      additional_kwargs,
      response_metadata,
      id,
      tool_calls,
      invalid_tool_calls,
      usage_metadata,
    } = res;
    const data: TAITextQueryData = {
      content,
      name,
      additional_kwargs,
      response_metadata,
      id,
      tool_calls,
      invalid_tool_calls,
      usage_metadata,
    };
    return data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[sendAiTextQuery] ❌ Error:', error);
    debugger; // eslint-disable-line no-debugger
    throw error;
  }
}
