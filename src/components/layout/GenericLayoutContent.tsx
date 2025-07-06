'use client';

import React from 'react';

// import { useLocale } from 'next-intl';
// import { setRequestLocale } from 'next-intl/server';

import { TPropsWithChildren } from '@/shared/types/generic';
import { sidebarLinks } from '@/config/dashboard';
import { cn } from '@/lib/utils';
import { NavBar } from '@/components/layout/NavBar';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { isDev } from '@/constants';
import { TExtendedUser } from '@/features/users/types/TUser';

// import { TLocale } from '@/i18n/types';

import { DashboardSidebar, MobileSheetSidebar, MobileSheetWrapper } from './DashboardSidebar';
import { NavMobile } from './NavMobile';

interface TGenericLayoutContentProps extends TPropsWithChildren {
  isUserRequired: boolean;
  user?: TExtendedUser;
}

export function GenericLayoutContent(props: TGenericLayoutContentProps) {
  const { children, user, isUserRequired } = props;
  const isUser = !!user;
  // const locale = useLocale() as TLocale;

  const [open, setOpen] = React.useState(false);

  const filteredLinks = sidebarLinks.map((section) => ({
    ...section,
    items: section.items.filter(
      ({ authorizedOnly }) => !authorizedOnly || authorizedOnly === user?.role,
    ),
  }));

  // setRequestLocale(locale);

  return (
    <div
      className={cn(
        isDev && '__GenericLayout', // DEBUG
        'relative flex size-full flex-col',
        // 'flex flex-1 flex-col items-center',
        'layout-follow',
        // commonXPaddingTwStyle,
      )}
    >
      {/*
      <DashboardSidebar links={filteredLinks} />
      */}
      <NavMobile isUser={isUser} isUserRequired={isUserRequired} />
      <MobileSheetWrapper open={open} setOpen={setOpen}>
        <MobileSheetSidebar links={filteredLinks} open={open} setOpen={setOpen} />
      </MobileSheetWrapper>
      <NavBar isUser={isUser} isUserRequired={isUserRequired} />
      <div
        className={cn(
          isDev && '__GenericLayout_HLayout', // DEBUG
          'relative flex size-full',
          // 'flex flex-1 flex-col items-center',
          'layout-follow',
          // commonXPaddingTwStyle,
        )}
      >
        {/*
        <NavMobile isUser={isUser} isUserRequired={isUserRequired} />
        */}
        <DashboardSidebar links={filteredLinks} />
        {children}
      </div>
      <SiteFooter />
    </div>
  );
}
