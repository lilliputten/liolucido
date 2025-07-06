'use client';

import * as React from 'react';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';

import { cn } from '@/lib/utils';
import { isDev } from '@/constants';

// @see https://www.radix-ui.com/primitives/docs/components/scroll-area

type ExtraProps = { viewportClassName?: string };
type ComponentType = React.ForwardRefExoticComponent<
  ScrollAreaPrimitive.ScrollAreaProps & React.RefAttributes<HTMLDivElement> // & ExtraProps
>;

const ScrollArea = React.forwardRef<
  React.ElementRef<ComponentType>,
  Omit<
    ScrollAreaPrimitive.ScrollAreaProps & React.RefAttributes<HTMLDivElement> & ExtraProps,
    'ref'
  >
  // React.ComponentPropsWithoutRef<RootComponentType>
>((props, ref) => {
  const { className, viewportClassName, children, ...rest } = props;
  return (
    <ScrollAreaPrimitive.Root
      ref={ref}
      className={cn(
        isDev && '__ScrollArea_Root', // DEBUG
        'relative overflow-hidden',
        className,
      )}
      {...rest}
    >
      <ScrollAreaPrimitive.Viewport
        className={cn(
          isDev && '__ScrollArea_Viewport', // DEBUG
          viewportClassName,
          'size-full rounded-[inherit]',
        )}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
});
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = 'vertical', ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      'flex touch-none transition-colors select-none',
      orientation === 'vertical' && 'h-full w-2.5 border-l border-l-transparent p-px',
      orientation === 'horizontal' && 'h-2.5 flex-col border-t border-t-transparent p-px',
      className,
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="bg-border relative flex-1 rounded-full" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };
