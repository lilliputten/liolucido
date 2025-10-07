'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

import { Spinner } from '../shared/Icons';

type ToasterProps = React.ComponentProps<typeof Sonner>;

export const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();
  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton: 'group-[.toast]:bg-theme group-[.toast]:text-theme-foreground',
          cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
          loading: 'animate-spin',
        },
      }}
      icons={{
        loading: <Spinner className="size-4 animate-spin opacity-50" />,
      }}
      {...props}
    />
  );
};
