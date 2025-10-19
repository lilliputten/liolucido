import React from 'react';
import { QueryKey, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { APIError } from '@/lib/types/api';
import { TAvailableQuestionsResultsQueryData } from '@/lib/types/react-query';
import { appendUrlQueries, composeUrlQuery } from '@/lib/helpers/urls';
import { TGetAvailableQuestionByIdParams } from '@/lib/zod-schemas';
import { minuteMs } from '@/constants';
import { getAvailableQuestionById } from '@/features/questions/actions';
import { TAvailableQuestion } from '@/features/questions/types';

interface TUseAvailableQuestionByIdProps extends TGetAvailableQuestionByIdParams {
  /** availableQuestionsQueryKey - A query key from `useAvailableQuestions` */
  availableQuestionsQueryKey?: QueryKey;
}

const staleTime = minuteMs * 10;

/** Get question data from cached `useAvailableQuestions` query data or fetch it now */
export function useAvailableQuestionById(props: TUseAvailableQuestionByIdProps) {
  const queryClient = useQueryClient();
  const { availableQuestionsQueryKey, id: questionId, ...queryProps } = props;

  /* Use partrial query url as a part of the query key */
  const queryUrlHash = React.useMemo(() => composeUrlQuery(queryProps), [queryProps]);

  const queryKey = React.useMemo<QueryKey>(
    () => ['available-question', questionId, queryUrlHash],
    [queryUrlHash, questionId],
  );

  // Check cached infinite query data first
  const availableQuestionsData: TAvailableQuestionsResultsQueryData | undefined =
    availableQuestionsQueryKey &&
    queryClient.getQueryData<TAvailableQuestionsResultsQueryData>(availableQuestionsQueryKey);

  // Try to find the question in cached infinite pages
  const cachedQuestion = availableQuestionsData?.pages
    .flatMap((page) => page.items)
    .find((question) => question.id === questionId);

  const isCached = !!cachedQuestion;

  // Only fetch if the question is not cached
  const query = useQuery<TAvailableQuestion>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey,
    staleTime, // Data validity period
    queryFn: async (_params) => {
      const url = appendUrlQueries(`/api/questions/${questionId}`, queryUrlHash);
      try {
        /* // OPTION 1: Using route api fetch
         * const result = await handleApiResponse<TAvailableQuestion>(fetch(url), {
         *   onInvalidateKeys: invalidateKeys,
         *   debugDetails: {
         *     initiator: 'useAvailableQuestionById',
         *     action: 'getAvailableQuestionById',
         *     url,
         *     queryProps,
         *     questionId,
         *   },
         * });
         * return result.data as TAvailableQuestion;
         */
        // OPTION 2: Using server function
        return await getAvailableQuestionById({ id: questionId, ...queryProps });
      } catch (error) {
        const details = error instanceof APIError ? error.details : null;
        const message = 'Cannot load question data';
        // eslint-disable-next-line no-console
        console.error('[useAvailableQuestionById:queryFn]', message, {
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
    enabled: !!questionId && !isCached, // Disable query if no ID or already cached
  });

  return {
    ...query,
    question: cachedQuestion ?? query.data,
    isCached,
    queryKey,
  };
}
