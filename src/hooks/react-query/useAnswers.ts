import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { APIError } from '@/lib/types/api';
import { handleApiResponse } from '@/lib/api';
import { useInvalidateReactQueryKeys } from '@/lib/data/invalidateReactQueryKeys';
import { minuteMs } from '@/constants';
import { TAnswerData } from '@/features/answers/types';

interface UseAnswersOptions {
  questionId?: string;
  enabled?: boolean;
}

const staleTime = minuteMs * 10;

export function useAnswers({ questionId, enabled = true }: UseAnswersOptions) {
  const invalidateKeys = useInvalidateReactQueryKeys();
  const query = useQuery({
    queryKey: ['answers', questionId],
    enabled: enabled && !!questionId,
    staleTime,
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
  return query;
}
