import { useTheme } from 'next-themes';

import { cn } from '@/lib/utils';
import { Icons } from '@/components/shared/icons';
import { secondaryColor } from '@/styles/cssVariables';
import { isDev } from '@/constants';

interface TWaitingSplashProps {
  show?: boolean;
  theme?: string;
}

export function WaitingSplash(props: TWaitingSplashProps) {
  const {
    // prettier-ignore
    show,
    theme: userTheme,
  } = props;
  const hidden = !show;
  // NOTE: Theme
  const { resolvedTheme } = useTheme();
  const theme = userTheme != undefined ? userTheme : resolvedTheme;
  const isLight = theme !== 'dark';
  return (
    <div
      className={cn(
        isDev && '__WaitingSplash',
        isDev && (hidden ? '__WaitingSplash_Hidden' : '__WaitingSplash_Visible'),
        'absolute',
        'inset-0',
        'flex',
        'flex-col',
        'items-center',
        'content-center',
        'justify-center',
        'transition',
        'duration-1000',
        hidden && 'opacity-0',
        hidden && 'pointer-events-none',
      )}
    >
      <div
        className={cn(
          isDev && '__WaitingSplash_Backdrop',
          'absolute',
          'inset-0',
          'opacity-80',
          isLight ? 'bg-backgroundLight' : 'bg-backgroundDark',
        )}
      />
      <Icons.spinner
        className={cn(
          // prettier-ignore
          'size-8',
          'animate-spin',
        )}
        // color={isLight ? foregroundLightColor : foregroundDarkColor} // XXX: Use theme color?
        color={secondaryColor}
      />
    </div>
  );
}
