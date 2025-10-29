import React from 'react';
import { QueryKey, useQuery } from '@tanstack/react-query';

import {
  AIGenerationError,
  AIGenerationErrorTexts,
  TAIGenerationErrorCode,
} from '@/lib/errors/AIGenerationError';
import { defaultStaleTime } from '@/constants';

import { getUserAIGenerationsLimits } from '../actions';
import { TAIGenerationsStatus, unlimitedGenerations } from '../types/TAIGenerationsStatus';

const staleTime = defaultStaleTime;

export const aiGenerationsStatusQueryKey: QueryKey = ['ai-generations-status'];

export function useAIGenerationsStatus() {
  const query = useQuery<TAIGenerationsStatus>({
    queryKey: aiGenerationsStatusQueryKey,
    staleTime,
    queryFn: async () => {
      // setReasonCode(undefined);
      try {
        return await getUserAIGenerationsLimits();
      } catch (error) {
        const isAIGenerationError =
          error instanceof AIGenerationError ||
          (error instanceof Error && error.name === 'AIGenerationError');
        let message = 'Error getting generations status';
        if (isAIGenerationError) {
          const code = error.message as TAIGenerationErrorCode;
          message = AIGenerationErrorTexts[code] || code;
          // eslint-disable-next-line no-console
          console.warn('[useAIGenerationsStatus:queryFn] AIGenerationError', message, {
            code,
            error,
          });
          debugger; // eslint-disable-line no-debugger
          // setReasonCode(code);
          // return false;
        } else {
          // eslint-disable-next-line no-console
          console.error('[useAIGenerationsStatus:queryFn] Unexpected error', message, {
            error,
          });
          debugger; // eslint-disable-line no-debugger
        }
        // toast.error(message);
        throw new Error(message);
      }
    },
  });

  const aiGenerationsStatus: TAIGenerationsStatus | undefined = query.data;
  const {
    availableGenerations, // number;
    usedGenerations, // number;
    generationMode, // TGenerationMode;
    role, // UserRoleType;
    grade, // UserGradeType;
    reasonCode, // TAIGenerationErrorCode;
  } = aiGenerationsStatus || {};

  const allowed =
    (!!availableGenerations && availableGenerations > 0) ||
    availableGenerations === unlimitedGenerations;

  React.useEffect(() => {
    console.log('[useAIGenerationsStatus:DEBUG]', {
      allowed,
      availableGenerations, // number;
      usedGenerations, // number;
      generationMode, // TGenerationMode;
      role, // UserRoleType;
      grade, // UserGradeType;
      reasonCode, // TAIGenerationErrorCode;
    });
  }, [
    allowed,
    availableGenerations, // number;
    usedGenerations, // number;
    generationMode, // TGenerationMode;
    role, // UserRoleType;
    grade, // UserGradeType;
    reasonCode, // TAIGenerationErrorCode;
  ]);

  return {
    // Core properties...
    availableGenerations, // number;
    usedGenerations, // number;
    generationMode, // TGenerationMode;
    role, // UserRoleType;
    grade, // UserGradeType;
    reasonCode, // TAIGenerationErrorCode;
    // Calculated properties...
    allowed,
    loading: !!query.isFetched || query.isLoading,
    error: query.error,
  };
}
