import { QueryKey, useQuery } from '@tanstack/react-query';

import { AIGenerationError } from '@/lib/errors/AIGenerationError';
import { defaultStaleTime } from '@/constants';

import { checkAllowedAIGenerations } from '../actions';

const staleTime = defaultStaleTime;

export const allowedAIGenerationsQueryKey: QueryKey = ['allowed-ai-generations'];

export function useAllowedAIGenerationsQuery() {
  const query = useQuery<boolean>({
    queryKey: allowedAIGenerationsQueryKey,
    staleTime,
    queryFn: async () => {
      try {
        return await checkAllowedAIGenerations();
      } catch (error) {
        const isAIGenerationError = error instanceof AIGenerationError;
        const message = 'Error getting allowed generations';
        if (isAIGenerationError) {
          // eslint-disable-next-line no-console
          console.warn('[useAllowedAIGenerationsQuery:queryFn] AIGenerationError', error.code, {
            error,
          });
          debugger; // eslint-disable-line no-debugger
          return false;
        } else {
          // eslint-disable-next-line no-console
          console.error('[useAllowedAIGenerationsQuery:queryFn] Unexpected error', message, {
            error,
          });
          debugger; // eslint-disable-line no-debugger
        }
        // toast.error(message);
        throw error;
      }
    },
  });

  return {
    allowed: query.data,
    loading: !!query.isFetched || query.isLoading,
    error: query.error,
  };
}
