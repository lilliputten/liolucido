'use server';

import { defaultAiClientType } from '@/lib/ai/types/TAiClientType';
import { prisma } from '@/lib/db';
import { AIGenerationError } from '@/lib/errors/AIGenerationError';
import { getCurrentUser } from '@/lib/session';

import { TPlainMessage } from '../types/messages';
import { TAITextQueryData } from '../types/TAITextQueryData';
import { checkUserAllowedGenerations } from './checkUserAllowedGenerations';
import { sendAiTextQuery } from './sendAiTextQuery';

interface TOptions {
  debugData?: boolean;
  topicId?: string;
}

export async function sendUserAIRequest(
  messages: TPlainMessage[],
  opts: TOptions = {},
): Promise<TAITextQueryData> {
  const { debugData, topicId } = opts;
  const clientType = defaultAiClientType;

  // Check if user is allowed to perform generations
  await checkUserAllowedGenerations();

  const user = await getCurrentUser();
  if (!user) {
    throw new AIGenerationError('USER_NOT_LOGGED');
  }

  const startTime = new Date();

  try {
    // Call the AI text query
    const result = await sendAiTextQuery(messages, { debugData, clientType });

    const endTime = new Date();
    const spentTimeMs = endTime.getTime() - startTime.getTime();
    const spentTokens = result.usage_metadata?.total_tokens || 0;

    // Create AIGeneration record
    await prisma.aIGeneration.create({
      data: {
        userId: user.id,
        topicId,
        modelUsed: clientType,
        spentTimeMs,
        spentTokens,
        createdAt: startTime,
        finishedAt: endTime,
      },
    });

    return result;
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    // eslint-disable-next-line no-console
    console.error('[sendUserAIRequest]', errMsg, {
      error,
      user,
    });
    debugger; // eslint-disable-line no-debugger
    // Re-throw errors from checkUserAllowedGenerations or other errors
    throw error;
  }
}
