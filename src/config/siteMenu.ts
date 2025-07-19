import { MainNavItem } from '@/shared/types/site/NavItem';

import { dataRoute, myTopicsRoute, welcomeRoute } from './routesConfig';

export type SiteMenu = {
  mainNav: MainNavItem[];
};

export const siteMenu: SiteMenu = {
  // TODO: See `src/config/dashboard.ts`
  mainNav: [
    {
      titleId: 'ManageTopics',
      href: myTopicsRoute,
      userRequiredOnly: true,
    },
    {
      titleId: 'Data',
      href: dataRoute,
      // userRequiredOnly: true,
    },
    {
      titleId: 'Welcome',
      href: welcomeRoute,
    },
  ],
};
