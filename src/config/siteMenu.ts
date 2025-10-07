import { MainNavItem } from '@/lib/types/site/NavItem';

import { availableTopicsRoute, myTopicsRoute, welcomeRoute } from './routesConfig';

export type SiteMenu = {
  mainNav: MainNavItem[];
};

export const siteMenu: SiteMenu = {
  // TODO: See `src/config/dashboard.ts`
  mainNav: [
    {
      titleId: 'MyTopics',
      href: myTopicsRoute,
      userRequiredOnly: true,
    },
    {
      titleId: 'AvailableTopics',
      href: availableTopicsRoute,
      // userRequiredOnly: true,
    },
    {
      titleId: 'Welcome',
      href: welcomeRoute,
    },
  ],
};
