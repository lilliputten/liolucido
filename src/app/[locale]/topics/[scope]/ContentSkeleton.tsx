import React from 'react';

import { TPropsWithClassName } from '@/lib/types/react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/Skeleton';
import { isDev } from '@/constants';

export function ContentSkeleton({ className }: TPropsWithClassName) {
  return (
    <div
      className={cn(
        isDev && '__ManageTopicsPage_ContentSkeleton', // DEBUG
        'size-full rounded-lg',
        'flex flex-1 flex-col gap-4 py-4',
        className,
      )}
    >
      <Skeleton className="h-8 w-48 rounded-lg" />
      <Skeleton className="h-8 w-full rounded-lg" />
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded-lg" />
      ))}
    </div>
  );
}
