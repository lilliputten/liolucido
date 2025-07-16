'use client';

import React from 'react';

import { PageError } from '@/components/shared/PageError';

// Error boundaries must be Client Components
// @see https://nextjs.org/docs/app/getting-started/error-handling

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Log the error to an error reporting service
    // eslint-disable-next-line no-console
    console.error('[src/app/[locale]/my-topics/error]', error);
    // debugger; // eslint-disable-line no-debugger
  }, [error]);

  return <PageError error={error} reset={reset} />;
}
