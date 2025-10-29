'use server';

import { HumanMessage, SystemMessage } from '@langchain/core/messages';

import { getAiClient } from '@/lib/ai/getAiClient';
import {
  generatedAnswersSchema,
  TGeneratedAnswers,
} from '@/features/ai/types/GenerateAnswersTypes';
import { TPlainMessage } from '@/features/ai/types/messages';

type TGenericMessage = HumanMessage | SystemMessage;

export async function generateQuestionAnswers(
  messages: TPlainMessage[],
  debugData: boolean = false,
): Promise<TGeneratedAnswers> {
  try {
    if (debugData) {
      await new Promise((r) => setTimeout(r, 1000));
      return {
        answers: [
          {
            text: 'Sample correct answer',
            explanation: 'This is correct because...',
            isCorrect: true,
          },
          {
            text: 'Sample wrong answer',
            explanation: 'This is wrong because...',
            isCorrect: false,
          },
        ],
        answersCount: 2,
      };
    }

    const preparedMessages: TGenericMessage[] = messages.map(({ role: type, content: text }) => {
      if (type === 'system') {
        return new SystemMessage(text);
      }
      return new HumanMessage(text);
    });

    const client = await getAiClient('GigaChat');
    const structuredClient = client.withStructuredOutput(generatedAnswersSchema);
    const result = await structuredClient.invoke(preparedMessages);

    return result as TGeneratedAnswers;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[generateQuestionAnswers] ❌ Error:', error);
    debugger; // eslint-disable-line no-debugger
    throw error;
  }
}
