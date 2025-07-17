import { UserRoles } from '@/shared/types/db/TUserRole';
import { SidebarNavItem } from '@/shared/types/site/NavItem';

import {
  adminRoute,
  chartsRoute,
  dashboardRoute,
  dataRoute,
  myTopicsRoute,
  rootRoute,
  settingsRoute,
  welcomeRoute,
} from './routesConfig';

export const sidebarLinks: SidebarNavItem[] = [
  {
    titleId: 'Your Data',
    authorizedOnly: UserRoles.USER,
    items: [
      // Other links?
      { href: myTopicsRoute, icon: 'lineChart', titleId: 'My Topics' },
    ],
  },
  // All available topics list
  {
    titleId: 'Application',
    items: [
      { href: dataRoute, icon: 'lineChart', titleId: 'Data' },
      { href: welcomeRoute, icon: 'lineChart', titleId: 'Welcome' },
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
