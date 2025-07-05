import * as React from 'react';
import { cva, VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  cn(
    'inline-flex',
    'items-center',
    'justify-center',
    'text-sm',
    'font-medium',
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-ring',
    'focus-visible:ring-offset-2',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
    'disabled:pointer-events-none',
    'ring-offset-background',
    'select-none',
    'active:scale-[0.98]',
    'transition-all',
    // 'duration-200',
  ),
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-app-destructive hover:bg-app-destructive/90 text-destructive-foreground',
        outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        ghostBlue: 'hover:bg-blue-300/20 hover:text-accent-foreground active:bg-blue-500',
        ghostDark: 'hover:bg-black/20 hover:text-accent-foreground',
        ghostGray: 'hover:bg-gray-500/15 hover:text-accent-foreground',
        ghostOnPrimary: 'text-primary-foreground hover:bg-primary-400/50',
        link: 'text-primary underline-offset-4 hover:underline',
        disable: 'cursor-not-allowed border border-input bg-transparent text-neutral-600',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
        icon: 'size-10 [&>svg]:m-auto',
        iconSm: 'size-8 [&>svg]:m-auto',
      },
      rounded: {
        default: 'rounded-md',
        sm: 'rounded-sm',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        '2xl': 'rounded-2xl',
        full: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      rounded: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, rounded, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, rounded, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
