import * as React from 'react';
import { QueryClient, QueryKey, useQueryClient } from '@tanstack/react-query';

// For backward compatibility, you can also export a function that takes queryClient as parameter
export function invalidateReactQueryKeys(queryClient: QueryClient, keys?: QueryKey[]) {
  if (keys && keys.length) {
    return keys.map((key) => {
      return queryClient.invalidateQueries({ queryKey: key });
    });
  }
  return [];
}

export function useInvalidateReactQueryKeys() {
  const queryClient = useQueryClient();
  return React.useCallback(
    (keys: QueryKey[]) => invalidateReactQueryKeys(queryClient, keys),
    [queryClient],
  );
}
