'use client';

import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

import { cn } from '@/lib/utils';
import { isDev } from '@/config';

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      isDev && '__Slider_Root', // DEBUG
      'relative',
      'flex',
      'w-full',
      'touch-none',
      'select-none',
      'items-center',
      className,
    )}
    {...props}
  >
    <SliderPrimitive.Track
      className={cn(
        isDev && '__Slider_Track', // DEBUG
        'relative',
        'h-2',
        'w-full',
        'grow',
        'overflow-hidden',
        'rounded-full',
        'bg-theme-500/20',
      )}
    >
      <SliderPrimitive.Range
        className={cn(
          isDev && '__Slider_Range', // DEBUG
          'absolute',
          'h-full',
          'bg-theme',
        )}
      />
    </SliderPrimitive.Track>
    {(props.value || props.defaultValue || [0]).map((_, index) => (
      <SliderPrimitive.Thumb
        key={index}
        className={cn(
          isDev && '__Slider_Thumb_' + index, // DEBUG
          'block',
          'size-5',
          'rounded-full',
          'border-2',
          'border-theme',
          'bg-background',
          'ring-offset-background',
          'transition-colors',
          'focus-visible:outline-none',
          'focus-visible:ring-2',
          'focus-visible:ring-ring',
          'focus-visible:ring-offset-2',
          'disabled:pointer-events-none',
          'disabled:opacity-50',
        )}
      />
    ))}
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
