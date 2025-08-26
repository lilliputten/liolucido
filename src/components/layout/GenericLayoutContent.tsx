'use client';

import React from 'react';
import { ExtendedUser } from '@/@types/next-auth';

import { TPropsWithChildren } from '@/shared/types/generic';
import { NavItemBase } from '@/shared/types/site/NavItem';
import { sidebarLinks } from '@/config/dashboard';
import { cn } from '@/lib/utils';
import { NavBar } from '@/components/layout/NavBar';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { isDev } from '@/constants';

import { DashboardSidebar, MobileSheetSidebar, MobileSheetWrapper } from './DashboardSidebar';

interface TGenericLayoutContentProps extends TPropsWithChildren {
  user?: ExtendedUser;
}

function checkIfLinkIsAllowedForUser(user: ExtendedUser | undefined, navItem: NavItemBase) {
  const { authorizedOnly } = navItem;
  if (!authorizedOnly) {
    return true;
  }
  if (authorizedOnly === true && !!user?.id) {
    return true;
  }
  return authorizedOnly === user?.role;
}

export function GenericLayoutContent(props: TGenericLayoutContentProps) {
  const { children, user } = props;
  const isUser = !!user;

  const [open, setOpen] = React.useState(false);

  const checkNavItem = checkIfLinkIsAllowedForUser.bind(undefined, user);

  const filteredLinks = sidebarLinks.filter(checkNavItem).map((section) => ({
    ...section,
    items: section.items.filter(checkNavItem),
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
      <MobileSheetWrapper open={open} setOpen={setOpen}>
        <MobileSheetSidebar isUser={isUser} links={filteredLinks} open={open} setOpen={setOpen} />
      </MobileSheetWrapper>
      <NavBar isUser={isUser} open={open} setOpen={setOpen} />
      <div
        className={cn(
          isDev && '__GenericLayout_HLayout', // DEBUG
          'relative flex size-full flex-1',
          'layout-follow',
        )}
      >
        <DashboardSidebar links={filteredLinks} />
        {children}
      </div>
      <SiteFooter />
    </div>
  );
}
