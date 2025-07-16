'use client';

import React from 'react';

import { ErrorLike } from '@/shared/types/errors';
import { getErrorText } from '@/lib/helpers/strings';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ErrorPlaceHolder } from '@/components/shared/ErrorPlaceHolder';
import { Icons } from '@/components/shared/icons';

interface TErrorProps {
  title?: string;
  error: ErrorLike; // Error & { message?: string };
  reset?: () => void;
  className?: string;
}

// NOTE: Only plain string should be passed from the server components
// otherwise you'll get an 'Only plain objects... can be passed...' error.

export function PageError(props: TErrorProps) {
  const { error, reset, className, title = 'Something went wrong!' } = props;
  const errText = getErrorText(error);
  React.useEffect(() => {
    const errText = getErrorText(error);
    // eslint-disable-next-line no-console
    console.error('[PageError:error]', errText, {
      error,
    });
    // TODO: Log the error to an error reporting service?
  }, [error]);

  return (
    <ErrorPlaceHolder className={cn(className, '__PageError')}>
      <ErrorPlaceHolder.Icon
        name="warning"
        // NOTE: Center warning triangle vertically
        className="-mt-1"
      />
      <ErrorPlaceHolder.Title>{title}</ErrorPlaceHolder.Title>
      <ErrorPlaceHolder.Description>
        {/* // To show only general message for the users?
        See error log for details.
        */}
        {errText}
      </ErrorPlaceHolder.Description>
      {!!reset && (
        <div className="flex w-full justify-center gap-4">
          <Button onClick={reset}>
            <Icons.refresh className="mr-2 size-4" />
            <span>Try again</span>
          </Button>
        </div>
      )}
    </ErrorPlaceHolder>
  );
}
