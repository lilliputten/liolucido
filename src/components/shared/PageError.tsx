'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { ErrorLike } from '@/shared/types/errors';
import { TReactNode } from '@/shared/types/generic';
import { rootRoute } from '@/config/routesConfig';
import { getErrorText } from '@/lib/helpers/strings';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ErrorPlaceHolder } from '@/components/shared/ErrorPlaceHolder';
import { Icons, TIconsKey } from '@/components/shared/icons';
import { isDev } from '@/constants';
import { useGoBack } from '@/hooks';

interface TErrorProps {
  title?: TReactNode;
  extraActions?: TReactNode;
  ExtraActions?: React.FunctionComponent;
  error?: ErrorLike; // Error & { message?: string };
  reset?: () => void;
  className?: string;
  iconName?: TIconsKey;
}

// NOTE: Only plain string should be passed from the server components
// otherwise you'll get an 'Only plain objects... can be passed...' error.

export function PageError(props: TErrorProps) {
  const {
    error,
    reset,
    className,
    title,
    iconName = 'warning',
    extraActions,
    ExtraActions,
  } = props;
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

  const goBack = useGoBack(rootRoute);

  const goHome = React.useCallback(() => {
    const { href } = window.location;
    // Do a hard reload
    // window.location.href = rootRoute;
    router.push(rootRoute);
    setTimeout(() => {
      // If still on the same page after trying to go back, fallback
      if (document.visibilityState === 'visible' && href === window.location.href) {
        window.location.href = rootRoute;
      }
    }, 200);
  }, [router]);

  return (
    <ErrorPlaceHolder
      className={cn(
        isDev && '__PageError', // DEBUG
        'm-6 overflow-auto',
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
      <div className="mt-2 flex w-full flex-wrap justify-center gap-4">
        <Button onClick={goBack} className="flex gap-2">
          <Icons.ArrowLeft className="size-4" />
          <span>Go back</span>
        </Button>
        <Button onClick={goHome} className="flex gap-2">
          <Icons.home className="size-4" />
          Go home
        </Button>
        {/*
        <Link href={rootRoute} className={cn(buttonVariants({ variant: 'default' }), 'flex gap-2')}>
          <Icons.home className="size-4" />
          <span>Go home</span>
        </Link>
        */}
        {!!reset && (
          <Button onClick={reset} className="flex gap-2">
            <Icons.refresh className="size-4" />
            <span>Try again</span>
          </Button>
        )}
        {extraActions}
        {ExtraActions && <ExtraActions />}
      </div>
    </ErrorPlaceHolder>
  );
}
