'use client';

import { useContext } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import { TPropsWithClassName } from '@/shared/types/generic';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/skeleton';
import { ModalContext } from '@/components/modals/providers';
import { Icons } from '@/components/shared/Icons';
import { isDev } from '@/constants';

import { NavUserAccount } from './NavUserAccount';
import { NavUserBlock } from './NavUserBlock';

interface TNavAuthButtonProps extends TPropsWithClassName {
  onPrimary?: boolean;
  onSidebar?: boolean;
  isUser?: boolean;
}

export function NavUserAuthButton(props: TNavAuthButtonProps) {
  const { onPrimary, onSidebar, isUser, className } = props;
  const { data: session, status } = useSession();
  const { setShowSignInModal } = useContext(ModalContext);
  const t = useTranslations('NavAuthButton');
  const hasValidUser = !!isUser && !!session && status === 'authenticated';
  return (
    <div
      className={cn(
        isDev && '__NavAuthButton', // DEBUG
        'flex',
        'items-center',
        onSidebar && 'flex w-full justify-start gap-2 px-2',
        className,
      )}
    >
      {hasValidUser && onSidebar ? (
        <NavUserBlock onPrimary={onPrimary} onSidebar={onSidebar} />
      ) : hasValidUser && !onSidebar ? (
        <NavUserAccount onPrimary={onPrimary} onSidebar={onSidebar} />
      ) : status === 'loading' ? (
        <Skeleton className="h-9 w-28 rounded-full lg:flex" />
      ) : (
        <Button
          className="gap-2 px-5 md:flex"
          variant={onPrimary ? 'ghostOnTheme' : 'ghost'}
          size="sm"
          onClick={() => setShowSignInModal(true)}
        >
          <span>{t('sign-in')}</span>
          <Icons.ArrowRight className="size-4" />
        </Button>
      )}
    </div>
  );
}
