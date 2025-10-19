export const aiClientTypes = [
  // ChatCloudflareWorkersAI
  'Cloudflare',
  // GigaChat
  'GigaChat',
] as const;
export type TAiClientType = (typeof aiClientTypes)[number];
export const defaultAiClientType: TAiClientType = 'GigaChat';

// Create enum object from aiClientTypes for z.nativeEnum
export const AiClientTypeEnum = aiClientTypes.reduce(
  (acc, type) => {
    acc[type] = type;
    return acc;
  },
  {} as Record<TAiClientType, TAiClientType>,
);
