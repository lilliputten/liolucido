import { TAiClientType } from '@/lib/ai/types/TAiClientType';

export interface TAiClientQueryData {
  model: TAiClientType;
  systemQueryText: string;
  userQueryText: string;
}
