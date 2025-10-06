'use client';

import { usePathname } from 'next/navigation';

import { TReactNode } from '@/lib/types';
import { cn } from '@/lib/utils';
import { TGenericIcon } from '@/components/shared/IconTypes';
import { PageError } from '@/components/shared/PageError';
import { isDev } from '@/constants';

// TODO: Force 404 status code for the response

interface TNotFoundScreenProps {
  title?: TReactNode;
  className?: string;
  icon?: TGenericIcon;
}

export default function NotFoundScreen(props: TNotFoundScreenProps) {
  const { title, className, icon } = props;
  const pathname = usePathname();
  const titleContent = title || (
    <>
      Page <u>{pathname}</u> not found!
    </>
  );
  return (
    <PageError
      className={cn(
        isDev && '__NotFoundScreen', // DEBUG
        className,
      )}
      icon={icon}
      title={titleContent}
    />
  );
}
