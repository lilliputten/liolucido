import React from 'react';

import { generateArray } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/Skeleton';
import { isDev } from '@/constants';

interface TProps {
  className?: string;
}

export function WorkoutQuestionBlockSkeleton({ className }: TProps) {
  return (
    <div
      className={cn(
        isDev && '__WorkoutQuestionBlockSkeleton', // DEBUG
        'flex flex-col gap-4 py-2',
        className,
      )}
    >
      <Skeleton className="h-10 w-full" />
      {/* Emulate answers */}
      <div className="grid gap-4 py-2 md:grid-cols-2">
        {generateArray(2).map((i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
      {/* Emulate buttons */}
      <div className="flex justify-center gap-4">
        {generateArray(2).map((i) => (
          <Skeleton key={i} className="h-10 w-28" />
        ))}
      </div>
    </div>
  );
}
