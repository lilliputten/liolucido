import { ChatCloudflareWorkersAI } from '@langchain/cloudflare';
import { GigaChat, GigaChatCallOptions } from 'langchain-gigachat';

import { defaultAiClientType, TAiClientType } from '@/lib/types/TAiClientType';
import {
  CLOUDFLARE_ACCOUNT_ID,
  CLOUDFLARE_API_TOKEN,
  GIGACHAT_CREDENTIALS,
  GIGACHAT_MODEL,
} from '@/config/envServer';
import { getHttpsAgent } from '@/lib/ai/getHttpsAgent';

export type TAiClient = GigaChat<GigaChatCallOptions> | ChatCloudflareWorkersAI;

const cachedClients: Partial<Record<TAiClientType, TAiClient>> = {};

// Create client instance
export async function getAiClient(clientType: TAiClientType = defaultAiClientType) {
  if (cachedClients[clientType]) {
    return cachedClients[clientType];
  }
  let client: TAiClient | undefined;
  try {
    if (clientType === 'Cloudflare') {
      // Cloudflare
      client = new ChatCloudflareWorkersAI({
        model: '@cf/meta/llama-3.1-8b-instruct', // Default value
        cloudflareAccountId: CLOUDFLARE_ACCOUNT_ID,
        cloudflareApiToken: CLOUDFLARE_API_TOKEN,
        // Pass a custom base URL to use Cloudflare AI Gateway
        // baseUrl: `https://gateway.ai.cloudflare.com/v1/{YOUR_ACCOUNT_ID}/{GATEWAY_NAME}/workers-ai/`,
      });
    } else if (clientType === 'GigaChat') {
      // GigaChat
      client = new GigaChat({
        credentials: GIGACHAT_CREDENTIALS,
        model: GIGACHAT_MODEL,
        useApiForTokens: true, // enable token counting via API
        httpsAgent: getHttpsAgent(),
      });
    }
    if (!client) {
      throw new Error(`Cannot create an ai client for "{clientType}".`);
    }
    return client;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[getAiClient] ❌ Error:', error);
    debugger; // eslint-disable-line no-debugger
    throw error;
  }
}
