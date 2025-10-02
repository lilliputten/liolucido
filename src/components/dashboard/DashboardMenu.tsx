'use client';

import React from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { Icons } from '@/components/shared/Icons';
import { isDev } from '@/constants';
import { useMediaQuery } from '@/hooks';

interface DashboardMenuProps {
  className?: string;
}

export function DashboardMenu(props: DashboardMenuProps) {
  const { className } = props;
  const [isDropdownOpen, setDropdownOpen] = React.useState(false);
  const mediaQuery = useMediaQuery();
  const { isDesktop } = mediaQuery;
  const closeAndRun = (func: () => void) => {
    setDropdownOpen(false);
    func();
  };
  const menuContent = (
    <div
      className={cn(
        isDev && '__DashboardMenu', // DEBUG
        'flex',
        isDesktop ? 'flex-wrap gap-2' : 'w-full flex-col gap-1',
        className,
      )}
    >
      {/*
      <Button variant="ghost" className="flex gap-2" onClick={() => closeAndRun(addAllowedUser)}>
        <Add className="size-4 opacity-50" />
        <span className="flex flex-1 truncate">Add new</span>
      </Button>
      <Button
        variant="ghost"
        className="flex gap-2"
        disabled={!hasSelected}
        onClick={() => closeAndRun(handleDeleteSelected)}
      >
        <Trash className="size-4 opacity-50" />
        <span className="flex flex-1 truncate">Delete selected</span>
      </Button>
      <Button
        variant="ghost"
        className="flex gap-2"
        disabled={isRefetching}
        onClick={() => closeAndRun(handleRefetch)}
      >
        <Refresh className={cn('size-4 opacity-50', isRefetching && 'animate-spin')} />
        <span className="flex flex-1 truncate">Reload</span>
      </Button>
      */}
      <Button variant="ghostTheme" className="flex gap-2">
        <Icons.add className="size-4 opacity-50" />
        <span className="flex flex-1 truncate">Add new</span>
      </Button>
      <Button variant="ghostTheme" size="sm" className="flex gap-2">
        <Icons.check className="size-4 opacity-50" />
        <span className="flex flex-1 truncate">Save</span>
      </Button>
    </div>
  );
  if (isDesktop) {
    return menuContent;
  }
  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger
        asChild
        aria-label="Show Menu"
        className={cn(
          isDev && '__AllowedUsersPage_DropdownMenuTrigger', // DEBUG
          // 'focus-visible:ring-2',
          // 'rounded-full',
        )}
      >
        <Button
          size="icon"
          variant="ghost"
          title="Show menu"
          className={cn(
            isDev && '__AllowedUsersPage_DropdownMenuToggle', // DEBUG
            'hover:bg-theme/20',
            'active:bg-theme active:text-theme-foreground',
            'ring-offset-background',
            'focus:ring-2',
            'focus:ring-ring',
            'focus:ring-offset-2',
            'data-[state=open]:bg-theme/20', // 'data-[state=open]:text-theme-foreground',
            'data-[state=open]:bg-theme/20',
            'data-[state=open]:ring-2',
            'data-[state=open]:ring-offset-2',
            'data-[state=open]:ring-theme/50',
          )}
        >
          <Icons.MenuVertical className="size-4 transition-all" />
          <span className="sr-only">Show menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className={cn(
          isDev && '__AllowedUsersPage_DropdownMenuContent', // DEBUG
          'bg-popover/80',
        )}
      >
        {menuContent}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
