import { MainNavItem } from '@/shared/types/site/NavItem';

export type SiteMenu = {
  mainNav: MainNavItem[];
};

export const siteMenu: SiteMenu = {
  mainNav: [
    {
      titleId: 'dataEditor',
      href: '/data',
      userRequiredOnly: true,
    },
    {
      titleId: 'info',
      href: '/info',
    },
  ],
};
