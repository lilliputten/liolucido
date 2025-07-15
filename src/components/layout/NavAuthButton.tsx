'use client';

import { useContext } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import { TPropsWithClassName } from '@/shared/types/generic';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ModalContext } from '@/components/modals/providers';
import { Icons } from '@/components/shared/icons';
import { isDev } from '@/constants';

import { NavUserAccount } from './NavUserAccount';

interface TNavAuthButtonProps extends TPropsWithClassName {
  onPrimary?: boolean;
  isUser?: boolean;
}

export function NavUserAuthButton(props: TNavAuthButtonProps) {
  const { onPrimary, isUser, className } = props;
  const { data: session, status } = useSession();
  const { setShowSignInModal } = useContext(ModalContext);
  const t = useTranslations('NavAuthButton');

  const rootClassName = cn(
    isDev && '__NavAuthButton', // DEBUG
    className,
    // isPending && 'transition-opacity [&:disabled]:opacity-30',
  );

  const hasValidUser = !!isUser && !!session && status === 'authenticated';

  return (
    <div
      className={cn(
        // prettier-ignore
        rootClassName,
        'flex',
        'items-center',
      )}
    >
      {hasValidUser ? (
        <>
          <NavUserAccount onPrimary={onPrimary} />
        </>
      ) : status === 'loading' ? (
        <Skeleton className="h-9 w-28 rounded-full lg:flex" />
      ) : (
        <Button
          className="gap-2 px-5 md:flex"
          variant={onPrimary ? 'ghostOnPrimary' : 'ghost'}
          size="sm"
          onClick={() => setShowSignInModal(true)}
        >
          <span>{t('sign-in')}</span>
          <Icons.arrowRight className="size-4" />
        </Button>
      )}
    </div>
  );
}
