import { generateArray } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/Skeleton';
import { isDev } from '@/constants';

interface TProps {
  className?: string;
}

export function ContentSkeleton({ className }: TProps) {
  return (
    <div
      className={cn(
        isDev && '__WorkoutTopic_ContentSkeleton', // DEBUG
        'size-full rounded-lg',
        'flex flex-1 flex-col gap-4',
        className,
      )}
    >
      {isDev && <p>WorkoutTopic_ContentSkeleton</p>}
      <Skeleton className="h-9 w-full rounded" />
      {generateArray(3).map((i) => (
        <Skeleton key={i} className="h-32 w-full rounded-xl" />
      ))}
    </div>
  );
}
