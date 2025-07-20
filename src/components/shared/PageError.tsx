'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { ErrorLike } from '@/shared/types/errors';
import { TReactNode } from '@/shared/types/generic';
import { getErrorText } from '@/lib/helpers/strings';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ErrorPlaceHolder } from '@/components/shared/ErrorPlaceHolder';
import { Icons, TIconsKey } from '@/components/shared/icons';
import { isDev } from '@/constants';

interface TErrorProps {
  title?: TReactNode;
  extraActions?: TReactNode;
  error?: ErrorLike; // Error & { message?: string };
  reset?: () => void;
  className?: string;
  iconName?: TIconsKey;
}

// NOTE: Only plain string should be passed from the server components
// otherwise you'll get an 'Only plain objects... can be passed...' error.

export function PageError(props: TErrorProps) {
  const { error, reset, className, title, iconName = 'warning', extraActions } = props;
  const router = useRouter();
  const errText = getErrorText(error);
  React.useEffect(() => {
    if (error) {
      const errText = getErrorText(error);
      // eslint-disable-next-line no-console
      console.error('[PageError:error]', errText, {
        error,
      });
    }
    // TODO: Log the error to an error reporting service?
  }, [error]);

  return (
    <ErrorPlaceHolder
      className={cn(
        isDev && '__PageError', // DEBUG
        className,
      )}
    >
      <ErrorPlaceHolder.Icon name={iconName} />
      <ErrorPlaceHolder.Title>{title || errText}</ErrorPlaceHolder.Title>
      {title && errText && (
        <ErrorPlaceHolder.Description>
          {/* // To show only general message for the users?
          See error log for details.
          */}
          {errText}
        </ErrorPlaceHolder.Description>
      )}
      <div className="mt-2 flex w-full justify-center gap-4">
        <Button onClick={() => router.back()} className="flex gap-2">
          <Icons.arrowLeft className="size-4" />
          <span>Go back</span>
        </Button>
        <Button onClick={() => router.push('/')} className="flex gap-2">
          <Icons.home className="size-4" />
          Go home
        </Button>
        {!!reset && (
          <Button onClick={reset} className="flex gap-2">
            <Icons.refresh className="size-4" />
            <span>Try again</span>
          </Button>
        )}
        {extraActions}
      </div>
    </ErrorPlaceHolder>
  );
}
