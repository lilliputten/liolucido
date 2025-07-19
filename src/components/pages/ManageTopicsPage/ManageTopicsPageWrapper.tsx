import { TPropsWithChildrenAndClassName } from '@/shared/types/generic';
import { cn } from '@/lib/utils';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { isDev } from '@/constants';

interface TProps extends TPropsWithChildrenAndClassName {
  inSkeleton?: boolean;
  inError?: boolean;
}

export function ManageTopicsPageWrapper(props: TProps) {
  const {
    className,
    children,
    // inSkeleton,
    // inError,
  } = props;
  return (
    <PageWrapper
      id="ManageTopicsPageWrapper"
      className={cn(
        isDev && '__ManageTopicsPageWrapper', // DEBUG
        className,
      )}
      innerClassName={cn(
        isDev && '__ManageTopicsPageWrapper_Inner', // DEBUG
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
