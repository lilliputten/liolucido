'use server';

import { AIMessageChunk, HumanMessage, SystemMessage } from '@langchain/core/messages';
import { GigaChatCallOptions } from 'langchain-gigachat';

import { getAiClient } from '@/lib/ai/getAiClient';
import { TAiClientType } from '@/lib/ai/types/TAiClientType';

import { TPlainMessage } from '../types/messages';

type TDataType = Pick<
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

type TGenericMessage = HumanMessage | SystemMessage;

export async function sendAiTextQuery(
  clientType: TAiClientType,
  messages: TPlainMessage[],
  __returnDebugData: boolean = false,
) {
  try {
    if (__returnDebugData) {
      await new Promise((r) => setTimeout(r, 1000));
      const rawData = await import('./sendAiTextQuery-gigachat-js-data-types.json');
      const data = { ...rawData.default } as TDataType;
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
    const data: TDataType = {
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
