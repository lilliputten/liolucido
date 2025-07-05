'use client';

import * as React from 'react';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';

import { cn } from '@/lib/utils';
import { isDev } from '@/constants';

// @see https://www.radix-ui.com/primitives/docs/components/scroll-area

type ExtraProps = { areaClassName?: string };
type RootComponentType = typeof ScrollAreaPrimitive.Root; // & ExtraProps;

const ScrollArea = React.forwardRef<
  React.ElementRef<RootComponentType & ExtraProps>,
  React.ComponentPropsWithoutRef<RootComponentType & ExtraProps>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn(
      isDev && '__ScrollArea:Root', // DEBUG
      'relative overflow-hidden',
      className,
    )}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport
      className={cn(
        isDev && '__ScrollArea:Viewport', // DEBUG
        'size-full rounded-[inherit]',
      )}
    >
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = 'vertical', ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      'flex touch-none select-none transition-colors',
      orientation === 'vertical' && 'h-full w-2.5 border-l border-l-transparent p-px',
      orientation === 'horizontal' && 'h-2.5 flex-col border-t border-t-transparent p-px',
      className,
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };
