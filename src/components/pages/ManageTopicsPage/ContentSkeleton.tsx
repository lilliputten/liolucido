import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { isDev } from '@/constants';

interface TProps {
  className?: string;
}

export function ContentSkeleton({ className }: TProps) {
  return (
    <div
      className={cn(
        isDev && '__ContentSkeleton', // DEBUG
        'size-full rounded-lg',
        'flex flex-1 flex-col gap-5',
        className,
      )}
    >
      <Skeleton className="w-full flex-1 rounded-lg" />
    </div>
  );
}
