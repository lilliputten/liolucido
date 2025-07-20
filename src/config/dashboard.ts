import { UserRoles } from '@/shared/types/db/TUserRole';
import { SidebarNavItem } from '@/shared/types/site/NavItem';

import {
  adminRoute,
  allTopicsRoute,
  chartsRoute,
  dashboardRoute,
  dataRoute,
  myTopicsRoute,
  rootRoute,
  settingsRoute,
  welcomeRoute,
} from './routesConfig';

// TODO: Allow to show generative data (like a topics count) in the sideboard titles (as badges?)

export const sidebarLinks: SidebarNavItem[] = [
  {
    titleId: 'My Data',
    authorizedOnly: true,
    items: [
      { href: myTopicsRoute, icon: 'Topics', titleId: 'My Topics' },
      {
        href: allTopicsRoute,
        icon: 'AllTopics',
        titleId: 'All Topics',
        authorizedOnly: UserRoles.ADMIN,
      },
      // Add other data links?
    ],
  },
  {
    titleId: 'Application',
    items: [
      { href: dataRoute, icon: 'Library', titleId: 'Available Topics' },
      { href: dataRoute, icon: 'Braces', titleId: 'Data' },
      { href: welcomeRoute, icon: 'Hand', titleId: 'Welcome' },
      {
        href: adminRoute,
        icon: 'laptop',
        titleId: 'Admin Panel',
        authorizedOnly: UserRoles.ADMIN,
        disabled: true,
      },
      { href: dashboardRoute, icon: 'dashboard', titleId: 'Dashboard', disabled: true },
      { href: chartsRoute, icon: 'lineChart', titleId: 'Charts', disabled: true },
    ],
  },
  {
    titleId: 'Options',
    items: [
      { href: settingsRoute, icon: 'settings', titleId: 'Settings', disabled: true },
      { href: rootRoute, icon: 'home', titleId: 'Homepage' },
      { href: rootRoute, icon: 'bookOpen', titleId: 'Documentation', disabled: true },
      {
        href: rootRoute,
        icon: 'messages',
        titleId: 'Support',
        authorizedOnly: UserRoles.USER,
        disabled: true,
      },
    ],
  },
];
