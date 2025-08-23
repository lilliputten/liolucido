'use client';

import React from 'react';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Icons } from '@/components/shared/icons';
import { PageError } from '@/components/shared/PageError';
import { isDev } from '@/constants';
import { useManageTopicsStore } from '@/stores/ManageTopicsStoreProvider';

// Error boundaries must be Client Components
// @see https://nextjs.org/docs/app/getting-started/error-handling

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // XXX: These action linkss seem to be broken (at least, in the dev server; if it's broken and in the prod server, then remove it completely)
  const { manageScope } = useManageTopicsStore();
  const topicsRoutePath = `/topics/${manageScope}`;
  const extraActions = (
    <Link
      href={topicsRoutePath}
      className={cn(buttonVariants({ variant: 'default' }), 'flex gap-2')}
    >
      <Icons.ArrowLeft className="size-4" />
      <span>To the topic</span>
    </Link>
  );

  return (
    <PageError
      className={cn(
        isDev && '__questions_error', // DEBUG
      )}
      error={error}
      reset={reset}
      extraActions={extraActions}
    />
  );
}
