import * as React from 'react';

import { cn } from '@/lib/utils';
import { isDev } from '@/constants';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps & { className?: string }>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          isDev && '__Textarea', // DEBUG
          'flex',
          'h-20',
          'w-full',
          'rounded-md',
          'border',
          'border-input',
          'bg-background/50',
          'text-sm',
          'px-3',
          'py-2',
          'ring-offset-background',
          'placeholder:text-foreground/10',
          'transition',
          // 'hover:bg-background',
          'hover:ring-2 hover:ring-theme-500/50',
          'focus-visible:bg-background',
          'focus-visible:outline-none',
          'focus-visible:ring-2',
          'focus-visible:ring-ring',
          'focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed',
          'disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = 'Textarea';

export { Textarea };
