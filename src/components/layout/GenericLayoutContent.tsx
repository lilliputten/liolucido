'use client';

import React from 'react';

import { TPropsWithChildren } from '@/shared/types/generic';
import { sidebarLinks } from '@/config/dashboard';
import { cn } from '@/lib/utils';
import { NavBar } from '@/components/layout/NavBar';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { isDev } from '@/constants';
import { TExtendedUser } from '@/features/users/types/TUser';

import { DashboardSidebar, MobileSheetSidebar, MobileSheetWrapper } from './DashboardSidebar';

interface TGenericLayoutContentProps extends TPropsWithChildren {
  user?: TExtendedUser;
}

export function GenericLayoutContent(props: TGenericLayoutContentProps) {
  const { children, user } = props;
  const isUser = !!user;

  const [open, setOpen] = React.useState(false);

  const filteredLinks = sidebarLinks
    .filter(({ authorizedOnly }) => !authorizedOnly || authorizedOnly === user?.role)
    .map((section) => ({
      ...section,
      items: section.items.filter(
        ({ authorizedOnly }) => !authorizedOnly || authorizedOnly === user?.role,
      ),
    }));

  return (
    <div
      className={cn(
        isDev && '__GenericLayoutContent', // DEBUG
        'relative flex size-full flex-col',
        'flex-1 flex-col items-center',
        'layout-follow',
      )}
    >
      {/*
      <DashboardSidebar links={filteredLinks} />
      <NavMobile isUser={isUser} />
      */}
      <MobileSheetWrapper open={open} setOpen={setOpen}>
        <MobileSheetSidebar links={filteredLinks} open={open} setOpen={setOpen} />
      </MobileSheetWrapper>
      <NavBar isUser={isUser} open={open} setOpen={setOpen} />
      <div
        className={cn(
          isDev && '__GenericLayout_HLayout', // DEBUG
          'relative flex size-full flex-1',
          'layout-follow',
        )}
      >
        {/*
        <NavMobile isUser={isUser} />
        */}
        <DashboardSidebar links={filteredLinks} />
        {children}
      </div>
      <SiteFooter />
    </div>
  );
}
