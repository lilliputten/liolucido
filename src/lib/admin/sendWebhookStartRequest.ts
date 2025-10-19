'use server';

import { BOT_TOKEN, WEBHOOK_HOST } from '@/config/envServer';
import { fetchJson } from '@/lib/helpers/requests';

type TSetWebHookResponse = {
  ok: boolean;
  result: boolean;
  description: string;
};

export async function sendWebhookStartRequest() {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook?url=${WEBHOOK_HOST}/api/bot`;
  try {
    const data = await fetchJson<TSetWebHookResponse>(url);
    return data;
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    // eslint-disable-next-line no-console
    console.error('[StartBotPage:sendWebhookStartRequest]', errMsg, { error });
    debugger; // eslint-disable-line no-debugger
    throw error;
  }
}
