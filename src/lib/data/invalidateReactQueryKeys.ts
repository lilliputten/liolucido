import { QueryClient, useQueryClient } from '@tanstack/react-query';

export function useInvalidateReactQueryKeys() {
  const queryClient = useQueryClient();

  return (keys: string[]) => {
    if (keys && keys.length) {
      // console.log('[WorkoutQuestionContainer] Invalidate keys:', keys);
      queryClient.invalidateQueries({ queryKey: keys });
    }
  };
}

// For backward compatibility, you can also export a function that takes queryClient as parameter
export function invalidateReactQueryKeys(queryClient: QueryClient, keys?: string[]) {
  if (keys && keys.length) {
    // console.log('[WorkoutQuestionContainer] Invalidate keys:', keys);
    queryClient.invalidateQueries({ queryKey: keys });
  }
}
