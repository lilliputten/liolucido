import * as React from 'react';
import { QueryClient, QueryKey, useQueryClient } from '@tanstack/react-query';

// For backward compatibility, you can also export a function that takes queryClient as parameter
export function invalidateReactQueryKeys(queryClient: QueryClient, keys?: QueryKey[]) {
  if (keys && keys.length) {
    keys.forEach((key) => {
      // TODO: Is it necessary to iterate keys?
      queryClient.invalidateQueries({ queryKey: key });
    });
  }
}

export function useInvalidateReactQueryKeys() {
  const queryClient = useQueryClient();
  return React.useMemo(
    () => (keys: QueryKey[]) => invalidateReactQueryKeys(queryClient, keys),
    [queryClient],
  );
}
