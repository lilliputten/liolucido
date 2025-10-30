'use server';

import { LOGGING_CHANNEL_ID } from '@/config/envServer';
import { getErrorText } from '@/lib/helpers';
import { getBot } from '@/features/bot/core/getBot';

export async function sendLoggingMessage(text: string) {
  try {
    const bot = getBot();
    /* console.log('[sendLoggingMessage]', {
     *   text,
     * });
     */
    await bot.api.sendMessage(LOGGING_CHANNEL_ID, text);
  } catch (error) {
    const errMsg = getErrorText(error);
    // eslint-disable-next-line no-console
    console.error('[sendUserAIRequest]', errMsg, {
      error,
      text,
    });
    debugger; // eslint-disable-line no-debugger
    // NOTE: Don't re-throw errors as it's a non-critical code
    // throw error;
  }
}
