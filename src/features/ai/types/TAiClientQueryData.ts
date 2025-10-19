import { TAiClientType } from '@/lib/types/TAiClientType';

export interface TAiClientQueryData {
  model: TAiClientType;
  systemQueryText: string;
  userQueryText: string;
}
