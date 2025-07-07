import { UserRoles } from '@/shared/types/db/TUserRole';
import { SidebarNavItem } from '@/shared/types/site/NavItem';

import {
  adminRoute,
  chartsRoute,
  dashboardRoute,
  rootRoute,
  settingsRoute,
  topicsRoute,
} from './routesConfig';

export const sidebarLinks: SidebarNavItem[] = [
  {
    titleId: 'Your Data',
    authorizedOnly: UserRoles.USER,
    items: [
      // Other links?
      { href: topicsRoute, icon: 'lineChart', titleId: 'Topics' },
    ],
  },
  {
    titleId: 'Application',
    items: [
      {
        href: adminRoute,
        icon: 'laptop',
        titleId: 'Admin Panel',
        authorizedOnly: UserRoles.ADMIN,
      },
      { href: dashboardRoute, icon: 'dashboard', titleId: 'Dashboard' },
      { href: chartsRoute, icon: 'lineChart', titleId: 'Charts' },
    ],
  },
  {
    titleId: 'Options',
    items: [
      { href: settingsRoute, icon: 'settings', titleId: 'Settings' },
      { href: rootRoute, icon: 'home', titleId: 'Homepage' },
      // { href: '/docs', icon: 'bookOpen', titleId: 'Documentation' },
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
