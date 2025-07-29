'use client';

import React from 'react';

import { cn } from '@/lib/utils';
import { PageError } from '@/components/shared/PageError';
import { isDev } from '@/constants';

// Error boundaries must be Client Components
// @see https://nextjs.org/docs/app/getting-started/error-handling

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <PageError
      className={cn(
        isDev && '__topics_error', // DEBUG
      )}
      error={error}
      reset={reset}
    />
  );
}
