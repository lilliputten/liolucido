import * as React from 'react';

import { cn } from '@/lib/utils';

import { TGenericIcon } from './IconTypes';

type EmptyPlaceholderProps = React.HTMLAttributes<HTMLDivElement> & {
  padded?: boolean;
  framed?: boolean;
};

export function EmptyPlaceholder({
  padded = true,
  framed = true,
  className,
  children,
  ...props
}: EmptyPlaceholderProps) {
  return (
    <div
      className={cn(
        'flex flex-1 items-center justify-center text-center shadow-sm animate-in fade-in-50',
        padded && 'p-8',
        framed && 'rounded-lg border border-dashed',
        className,
      )}
      {...props}
    >
      <div className="flex max-w-[420px] flex-col items-center text-center">{children}</div>
    </div>
  );
}

interface EmptyPlaceholderIconProps /*extends Partial<React.SVGProps<SVGSVGElement>>*/ {
  icon: TGenericIcon;
  className?: string;
  ref?: ((instance: SVGSVGElement | null) => void) | React.RefObject<SVGSVGElement> | null;
}

EmptyPlaceholder.Icon = function EmptyPlaceholderIcon({
  icon: Icon,
  className,
  ...props
}: EmptyPlaceholderIconProps) {
  // const Icon = Icons[Icon];

  if (!Icon) {
    return null;
  }

  return (
    <div className="flex size-20 items-center justify-center rounded-full bg-muted">
      <Icon className={cn('size-10', className)} {...props} />
    </div>
  );
};

type EmptyPlaceholderTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

EmptyPlaceholder.Title = function EmptyPlaceholderTitle({
  className,
  ...props
}: EmptyPlaceholderTitleProps) {
  return <h3 className={cn('mt-5 font-heading text-2xl font-bold', className)} {...props} />;
};

type EmptyPlaceholderDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

EmptyPlaceholder.Description = function EmptyPlaceholderDescription({
  className,
  ...props
}: EmptyPlaceholderDescriptionProps) {
  return (
    <p
      className={cn(
        'mb-5 mt-1.5 text-center text-sm font-normal leading-6 text-muted-foreground',
        className,
      )}
      {...props}
    />
  );
};
