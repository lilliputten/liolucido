import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface TProps {
  className?: string;
}

export function ContentSkeleton({ className }: TProps) {
  return (
    <div
      className={cn(
        className,
        '__Skeleton size-full rounded-lg',
        'flex flex-1 flex-col gap-5',
        // 'border border-dashed border-black/50', // DEBUG: Show border
      )}
    >
      <Skeleton className="w-full flex-1 rounded-lg" />
      {/*
      <Skeleton className="max-h-[300px] w-full flex-1 rounded-lg" />
      */}
    </div>
  );
}
