'use client';

import React from 'react';
import { useSession } from 'next-auth/react';

import { TPropsWithClassName } from '@/shared/types/generic';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserAvatar } from '@/components/shared/user-avatar';
import { isDev } from '@/constants';

import { NavUserBlock } from './NavUserBlock';

interface TNavUserAccountProps extends TPropsWithClassName {
  onPrimary?: boolean;
  onSidebar?: boolean;
}

export function NavUserAccount(props: TNavUserAccountProps) {
  const { onPrimary, onSidebar, className } = props;
  const { data: session } = useSession();
  const user = session?.user;
  // const t = useTranslations('NavUserAccount');

  const [open, setOpen] = React.useState(false);

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
            onSidebar && 'flex',
          )}
        />
        {onSidebar && (
          <span className="flex items-center gap-2">
            {user.name && <span>{user.name}</span>}
            {user.email && <span className="truncate text-muted-foreground">{user.email}</span>}
          </span>
        )}
      </DropdownMenuTrigger>

      <NavUserBlock align="end" onPrimary={onPrimary} onSidebar={onSidebar} />
    </DropdownMenu>
  );
}
