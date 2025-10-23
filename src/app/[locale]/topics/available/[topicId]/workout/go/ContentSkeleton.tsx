import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/Skeleton';
import { WorkoutQuestionBlockSkeleton } from '@/components/pages/AvailableTopics/WorkoutQuestionBlock/WorkoutQuestionBlockSkeleton';
import { isDev } from '@/constants';

interface TProps {
  className?: string;
}

export function ContentSkeleton({ className }: TProps) {
  return (
    <div
      className={cn(
        isDev && '__WorkoutTopicGo_ContentSkeleton', // DEBUG
        'flex size-full flex-1 flex-col gap-4 px-6',
        className,
      )}
    >
      <div className="flex flex-col gap-4">
        <Skeleton className="h-4 w-2/3 rounded-lg" />
        <Skeleton className="h-8 w-1/3 rounded-lg" />
      </div>
      <div className="h-4" />
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-3/5 rounded-lg" />
        <Skeleton className="h-4 w-4/5 rounded-lg" />
        <Skeleton className="h-4 w-2/3 rounded-lg" />

        <div className="h-2" />

        <Skeleton className="h-4 w-1/3 rounded-lg" />
        <Skeleton className="h-2 w-full rounded-lg" />

        <WorkoutQuestionBlockSkeleton />
      </div>
    </div>
  );
}
