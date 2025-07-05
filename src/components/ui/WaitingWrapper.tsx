import { useTheme } from 'next-themes';

import { TPropsWithChildren } from '@/shared/types/generic';
import { cn } from '@/lib/utils';
import { isDev } from '@/constants';

interface TWaitingWrapperProps extends TPropsWithChildren {
  show?: boolean;
  theme?: string;
}

export function WaitingWrapper(props: TWaitingWrapperProps) {
  const {
    // prettier-ignore
    show,
    theme: userTheme,
    children,
  } = props;
  const hidden = !show;
  // NOTE: Theme
  const { resolvedTheme } = useTheme();
  const theme = userTheme != undefined ? userTheme : resolvedTheme;
  const isLight = theme !== 'dark';
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
        isLight ? 'bg-backgroundLight' : 'bg-backgroundDark',
        hidden && 'opacity-0',
        hidden && 'pointer-events-none',
      )}
    >
      {children}
    </div>
  );
}
