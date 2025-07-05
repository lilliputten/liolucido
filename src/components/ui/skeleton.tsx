import { cn } from '@/lib/utils';
import { isDev } from '@/constants';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        // prettier-ignore
        isDev && '__Skeleton',
        className,
        'animate-pulse rounded-md',
        'bg-muted',
      )}
      {...props}
    />
  );
}

export { Skeleton };
