'use client';

import { useState } from 'react';
import { LayoutDashboard, LogOut, Settings } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import { TPropsWithClassName } from '@/shared/types/generic';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserAvatar } from '@/components/shared/user-avatar';
import { isDev } from '@/constants';
import { Link } from '@/i18n/routing';

interface TNavUserAccountProps extends TPropsWithClassName {
  onPrimary?: boolean;
}

export function NavUserAccount(props: TNavUserAccountProps) {
  const {
    // onPrimary,
    className,
  } = props;
  const { data: session } = useSession();
  const user = session?.user;
  const t = useTranslations('NavUserAccount');

  const [open, setOpen] = useState(false);

  if (!user) {
    return <div className="size-8 animate-pulse rounded-full border bg-muted" />;
  }

  // const isAdmin = user.role === 'ADMIN';

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        className={cn(
          isDev && '__NavUserAccount:DropdownMenuTrigger', // DEBUG
          className,
          'rounded-full',
          'transition-all',
          'text-primary-foreground/80',
          'opacity-100',
          'hover:opacity-80',
        )}
      >
        <UserAvatar
          user={{ name: user.name || null, image: user.image || null }}
          className={cn(
            isDev && '__NavUserAccount:UserAvatar', // DEBUG
            className,
            'rounded-full',
            'bg-primary-300/25',
            'size-8',
          )}
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && <p className="font-medium">{user.name}</p>}
            {user.email && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
            )}
          </div>
        </div>

        <DropdownMenuSeparator />

        {/*isAdmin && (
          <DropdownMenuItem asChild>
            <Link
              href="/admin"
              className={cn(
                // prettier-ignore
                'flex items-center space-x-2.5',
                'disabled', // UNUSED
              )}
            >
              <Lock className="size-4" />
              <p className="text-sm">{t('Admin')}</p>
            </Link>
          </DropdownMenuItem>
          )*/}

        <DropdownMenuItem asChild>
          <Link
            href="/" // dashboard
            className={cn(
              // prettier-ignore
              'flex items-center space-x-2.5',
              'disabled', // UNUSED
            )}
          >
            <LayoutDashboard className="size-4" />
            <p className="text-sm">{t('Dashboard')}</p>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href="/" // "/dashboard/settings"
            className={cn(
              // prettier-ignore
              'flex items-center space-x-2.5',
              'disabled', // UNUSED
            )}
          >
            <Settings className="size-4" />
            <p className="text-sm">{t('Settings')}</p>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(event) => {
            event.preventDefault();
            signOut({
              callbackUrl: `${window.location.origin}/`,
            });
          }}
        >
          <div className="flex items-center space-x-2.5">
            <LogOut className="size-4" />
            <p className="text-sm">{t('Log out')}</p>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
