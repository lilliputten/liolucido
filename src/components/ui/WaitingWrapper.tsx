import React from 'react';
import { useTheme } from 'next-themes';

import { TPropsWithChildren } from '@/lib/types';
import { cn } from '@/lib/utils';
import { isDev } from '@/constants';

interface TWaitingWrapperProps extends TPropsWithChildren {
  show?: boolean;
  theme?: string;
}

export function WaitingWrapper(props: TWaitingWrapperProps) {
  const { show, theme: userTheme, children } = props;
  const hidden = !show;
  const { resolvedTheme } = useTheme();
  // NOTE: Prevent nextjs hydration error
  const [isLight, setIsLight] = React.useState<boolean | undefined>();
  React.useEffect(() => {
    const theme = userTheme != undefined ? userTheme : resolvedTheme;
    setIsLight(theme !== 'dark');
  }, [resolvedTheme, userTheme]);
  return (
    <div
      className={cn(
        isDev && '__WaitingWrapper',
        isDev && (hidden ? '__WaitingWrapper_Hidden' : '__WaitingWrapper_Visible'),
        'absolute',
        'inset-0',
        'flex',
        'flex-col',
        'items-center',
        'content-center',
        'justify-center',
        'transition',
        'duration-1000',
        isLight !== undefined && (isLight ? 'bg-background-light' : 'bg-background-dark'),
        hidden && 'opacity-0',
        hidden && 'pointer-events-none',
      )}
    >
      {children}
    </div>
  );
}
