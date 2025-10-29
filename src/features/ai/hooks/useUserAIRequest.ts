import * as React from 'react';

import { useInvalidateReactQueryKeys } from '@/lib/data';
import { aiGenerationsStatusQueryKey } from '@/features/ai-generations/query-hooks';

import { sendUserAIRequest, TAIRequestOptions } from '../actions';
import { TAITextQueryData } from '../types';
import { TPlainMessage } from '../types/messages';

type TOptions = TAIRequestOptions;

/** Send AI query and invalidate allowedAIGenerationsQuery */
export function useUserAIRequest() {
  const invalidateKeys = useInvalidateReactQueryKeys();
  return React.useCallback(
    async (messages: TPlainMessage[], opts: TOptions = {}) => {
      const queryData: TAITextQueryData = await sendUserAIRequest(messages, opts);
      invalidateKeys([aiGenerationsStatusQueryKey]);
      return queryData;
    },
    [invalidateKeys],
  );
}
