'use client';

import { usePathname } from 'next/navigation';

import { TReactNode } from '@/shared/types/generic';
import { cn } from '@/lib/utils';
import { TIconsKey } from '@/components/shared/icons';
import { PageError } from '@/components/shared/PageError';
import { isDev } from '@/constants';

// TODO: Force 404 status code for the response

interface TNotFoundScreenProps {
  title?: TReactNode;
  className?: string;
  iconName?: TIconsKey;
}

export default function NotFoundScreen(props: TNotFoundScreenProps) {
  const { title, className, iconName } = props;
  const pathname = usePathname();
  const titleContent = title || (
    <>
      Page <u>{pathname}</u> not found!
    </>
  );
  return (
    <>
      <PageError
        className={cn(
          isDev && '__NotFoundScreen', // DEBUG
          className,
        )}
        iconName={iconName}
        title={titleContent}
      />
    </>
  );
}
