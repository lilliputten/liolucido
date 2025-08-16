import { handleApiResponse } from '@/lib/api';
import { TAnswer } from '@/features/answers/types';

// Example: Update an answer
async function updateAnswerExample(answerId: string, data: Partial<TAnswer>) {
  const result = await handleApiResponse<TAnswer>(
    fetch(`/api/answers/${answerId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
    {
      onInvalidateKeys: (_keys) => {
        // Auto-invalidate React Query cache
        // queryClient.invalidateQueries({ queryKey: _keys });
      },
      onError: (error) => {
        // Custom error handling
        // eslint-disable-next-line no-console
        console.error('Update failed:', error.code, error.message);
        debugger; // eslint-disable-line no-debugger
      },
    },
  );

  if (result.ok) {
    // Success - data is typed as TAnswer
    // console.log('Updated answer:', result.data);
    return result.data;
  } else {
    // Error - handle result.error
    throw new Error(result.error?.message || 'Update failed');
  }
}

// Example: Get answers list
async function getAnswersExample(questionId: string) {
  const result = await handleApiResponse<TAnswer[]>(fetch(`/api/questions/${questionId}/answers`));
  return result.ok ? result.data : [];
}

// eslint-disable-next-line no-console
console.log('DEMO: These are only local examples', {
  updateAnswerExample,
  getAnswersExample,
});
