import { TPropsWithChildrenAndClassName } from '@/shared/types/generic';
import { cn } from '@/lib/utils';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { isDev } from '@/constants';

interface TProps extends TPropsWithChildrenAndClassName {
  inSkeleton?: boolean;
  inError?: boolean;
}

export function MyTopicsPageWrapper(props: TProps) {
  const {
    className,
    children,
    // inSkeleton,
    // inError,
  } = props;
  return (
    <PageWrapper
      className={cn(
        isDev && '__MyTopicsPageWrapper', // DEBUG
        className,
      )}
      innerClassName={cn(
        isDev && '__MyTopicsPageWrapper_Inner', // DEBUG
        'w-full rounded-lg gap-4',
        // !inError && 'border border-solid border-gray-500/30',
      )}
      // scrollable={!inSkeleton}
      limitWidth
      padded
      vPadded
    >
      {children}
    </PageWrapper>
  );
}
