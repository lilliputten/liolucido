import { generateArray } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/Skeleton';
import { isDev } from '@/constants';

interface TProps {
  className?: string;
}

export function CardContentSkeleton() {
  return (
    <div
      className={cn(
        isDev && '__CardContentSkeleton', // DEBUG
        'grid w-full gap-4 p-4 md:grid-cols-2',
      )}
    >
      {generateArray(5).map((i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}

export function ContentSkeleton({ className }: TProps) {
  return (
    <div
      className={cn(
        isDev && '__ContentSkeleton', // DEBUG
        'size-full rounded-lg',
        'flex flex-1 flex-col gap-2',
        className,
      )}
    >
      <div className="mx-4 flex items-center gap-2">
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-7 w-64 rounded" />
          <Skeleton className="h-4 w-80 rounded" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24 rounded" />
          <Skeleton className="h-8 w-24 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </div>
      <CardContentSkeleton />
    </div>
  );
}
