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
        'bg-theme-500/20',
        'backdrop-sepia-[20%]',
      )}
      {...props}
    />
  );
}

export { Skeleton };
