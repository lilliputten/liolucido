import { UserRoles } from '@/shared/types/db/TUserRole';
import { SidebarNavItem } from '@/shared/types/site/NavItem';
import * as Icons from '@/components/shared/Icons';

import {
  adminRoute,
  allTopicsRoute,
  availableTopicsRoute,
  chartsRoute,
  dashboardRoute,
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
      { href: myTopicsRoute, icon: Icons.Topics, titleId: 'My Topics' },
      {
        href: allTopicsRoute,
        icon: Icons.AllTopics,
        titleId: 'All Topics',
        authorizedOnly: UserRoles.ADMIN,
      },
      // Add other data links?
    ],
  },
  {
    titleId: 'Application',
    items: [
      { href: availableTopicsRoute, icon: Icons.Library, titleId: 'Available Topics' },
      // { href: availableTopicsRoute, icon: Icons.Braces, titleId: 'Data' },
      { href: welcomeRoute, icon: Icons.Hand, titleId: 'Welcome' },
      {
        href: adminRoute,
        icon: Icons.Laptop,
        titleId: 'Admin Panel',
        authorizedOnly: UserRoles.ADMIN,
        disabled: true,
      },
      { href: dashboardRoute, icon: Icons.Dashboard, titleId: 'Dashboard', disabled: true },
      { href: chartsRoute, icon: Icons.LineChart, titleId: 'Charts', disabled: true },
    ],
  },
  {
    titleId: 'Options',
    items: [
      { href: settingsRoute, icon: Icons.Settings, titleId: 'Settings' },
      { href: rootRoute, icon: Icons.Home, titleId: 'Homepage' },
      { href: rootRoute, icon: Icons.BookOpen, titleId: 'Documentation', disabled: true },
      {
        href: rootRoute,
        icon: Icons.Messages,
        titleId: 'Support',
        authorizedOnly: UserRoles.USER,
        disabled: true,
      },
    ],
  },
];
