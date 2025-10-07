import { TPropsWithChildrenAndClassName } from '@/lib/types';
import { cn } from '@/lib/utils';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { isDev } from '@/constants';

interface TProps extends TPropsWithChildrenAndClassName {
  inSkeleton?: boolean;
  inError?: boolean;
  noPadded?: boolean;
}

export function AvailableTopicsPageWrapper(props: TProps) {
  const {
    className,
    children,
    noPadded,
    // inSkeleton,
    // inError,
  } = props;
  return (
    <PageWrapper
      id="AvailableTopicsPageWrapper"
      className={cn(
        isDev && '__AvailableTopicsPageWrapper', // DEBUG
        className,
      )}
      innerClassName={cn(
        isDev && '__AvailableTopicsPageWrapper_Inner', // DEBUG
        'w-full rounded-lg gap-4',
        // !inError && 'border border-solid border-gray-500/30',
      )}
      // scrollable={!inSkeleton}
      limitWidth
      padded={!noPadded}
    >
      {children}
    </PageWrapper>
  );
}
