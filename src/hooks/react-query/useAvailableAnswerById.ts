import React from 'react';
import { QueryKey, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { APIError } from '@/lib/types/api';
import { TAvailableAnswersResultsQueryData } from '@/lib/types/react-query';
import { appendUrlQueries, composeUrlQuery } from '@/lib/helpers/urls';
import { TGetAvailableAnswerByIdParams } from '@/lib/zod-schemas';
import { minuteMs } from '@/constants';
import { getAvailableAnswerById } from '@/features/answers/actions/getAvailableAnswerById';
import { TAvailableAnswer } from '@/features/answers/types';

interface TUseAvailableAnswerByIdProps extends TGetAvailableAnswerByIdParams {
  /** availableAnswersQueryKey - A query key from `useAvailableAnswers` */
  availableAnswersQueryKey?: QueryKey;
  enabled?: boolean;
}

const staleTime = minuteMs * 10;

/** Get answer data from cached `useAvailableAnswers` query data or fetch it now */
export function useAvailableAnswerById(props: TUseAvailableAnswerByIdProps) {
  const queryClient = useQueryClient();
  // const invalidateKeys = useInvalidateReactQueryKeys();
  const { availableAnswersQueryKey, id: answerId, enabled, ...queryProps } = props;

  /* Use partrial query url as a part of the query key */
  const queryUrlHash = React.useMemo(() => composeUrlQuery(queryProps), [queryProps]);

  const queryKey = React.useMemo<QueryKey>(
    () => ['available-answer', answerId, queryUrlHash],
    [queryUrlHash, answerId],
  );

  // Check cached infinite query data first
  const availableAnswersData: TAvailableAnswersResultsQueryData | undefined =
    availableAnswersQueryKey &&
    queryClient.getQueryData<TAvailableAnswersResultsQueryData>(availableAnswersQueryKey);

  // Try to find the answer in cached infinite pages
  const cachedAnswer = availableAnswersData?.pages
    .flatMap((page) => page.items)
    .find((answer) => answer.id === answerId);

  const isCached = !!cachedAnswer;

  // Only fetch if the answer is not cached
  const query = useQuery<TAvailableAnswer>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey,
    staleTime, // Data validity period
    enabled: enabled && !isCached, // Disable query if already cached
    queryFn: async (_params) => {
      const url = appendUrlQueries(`/api/answers/${answerId}`, queryUrlHash);
      try {
        /* // OPTION 1: Using route api fetch
         * const result = await handleApiResponse<TAvailableAnswer>(fetch(url), {
         *   onInvalidateKeys: invalidateKeys,
         *   debugDetails: {
         *     initiator: 'useAvailableAnswerById',
         *     action: 'getAvailableAnswerById',
         *     url,
         *     queryProps,
         *     answerId,
         *   },
         * });
         * return result.data as TAvailableAnswer;
         */
        // OPTION 2: Using server function
        return await getAvailableAnswerById({ id: answerId, ...queryProps });
      } catch (error) {
        const details = error instanceof APIError ? error.details : null;
        const message = 'Cannot load answer data';
        // eslint-disable-next-line no-console
        console.error('[useAvailableAnswerById:queryFn]', message, {
          details,
          error,
          url,
        });
        // eslint-disable-next-line no-debugger
        debugger;
        toast.error(message);
        throw error;
      }
    },
  });

  return {
    ...query,
    answer: cachedAnswer ?? query.data,
    isCached,
    queryKey,
  };
}
