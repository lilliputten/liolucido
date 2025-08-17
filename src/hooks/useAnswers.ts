import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { APIError } from '@/shared/types/api';
import { handleApiResponse } from '@/lib/api';
import { useInvalidateReactQueryKeys } from '@/lib/data/invalidateReactQueryKeys';
import { TAnswerData } from '@/features/answers/types';

interface UseAnswersOptions {
  questionId?: string;
  enabled?: boolean;
}

export function useAnswers({ questionId, enabled = true }: UseAnswersOptions) {
  const invalidateKeys = useInvalidateReactQueryKeys();

  return useQuery({
    queryKey: ['answers', questionId],
    enabled: enabled && !!questionId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    queryFn: async () => {
      if (!questionId) return [];
      const url = `/api/questions/${questionId}/answers`;
      try {
        const result = await handleApiResponse<TAnswerData[]>(fetch(url), {
          debugDetails: { initiator: 'useAnswers', url },
          onInvalidateKeys: invalidateKeys,
        });
        if (result.ok && result.data) {
          return result.data;
        }
        return [];
      } catch (error) {
        const details = error instanceof APIError ? error.details : null;
        const message = 'Cannot load answers';
        // eslint-disable-next-line no-console
        console.error('[useAnswers:queryFn]', message, {
          details,
          error,
          questionId,
          url,
        });
        // eslint-disable-next-line no-debugger
        debugger;
        toast.error(message);
        throw error;
      }
    },
  });
}
