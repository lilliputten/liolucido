'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const ReactQueryClientProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Optional: Configure default staleTime for SSR to avoid immediate refetching
            staleTime: 60 * 1000,
          },
        },
        // @ts-expect-error: parameter
        experimental: {
          prefetchInRender: true,
        },
      }),
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
