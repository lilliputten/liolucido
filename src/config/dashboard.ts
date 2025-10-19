import { SidebarNavItem } from '@/lib/types/site/NavItem';
import { UserRoles } from '@/lib/db/TUserRole';
import * as Icons from '@/components/shared/Icons';

import {
  adminAiTestTextQueryRoute,
  adminBotControlRoute,
  allTopicsRoute,
  availableTopicsRoute,
  chartsRoute,
  myTopicsRoute,
  rootRoute,
  settingsRoute,
  welcomeRoute,
} from './routesConfig';

// TODO: Allow to show generative data (like a topics count) in the sideboard titles (as badges?)

// prettier-ignore
export const sidebarLinks: SidebarNavItem[] = [
  {
    titleId: 'My Data',
    authorizedOnly: true,
    items: [
      { href: myTopicsRoute, icon: Icons.Topics, titleId: 'My Topics' },
      { href: allTopicsRoute, icon: Icons.AllTopics, titleId: 'All Topics', authorizedOnly: UserRoles.ADMIN },
      // Add other data links?
    ],
  },
  {
    titleId: 'Administration',
    authorizedOnly: UserRoles.ADMIN,
    items: [
      { href: adminBotControlRoute, icon: Icons.FlaskConical, titleId: 'Bot Control' },
      { href: adminAiTestTextQueryRoute, icon: Icons.FlaskConical, titleId: 'Test AI Text Query' },
    ],
  },
  {
    titleId: 'Application',
    items: [
      { href: availableTopicsRoute, icon: Icons.Library, titleId: 'Available Topics' },
      // { href: availableTopicsRoute, icon: Icons.Braces, titleId: 'Data' },
      { href: welcomeRoute, icon: Icons.Hand, titleId: 'Welcome' },
      // { href: adminRoute, icon: Icons.Laptop, titleId: 'Admin Panel', authorizedOnly: UserRoles.ADMIN, disabled: true },
      // { href: dashboardRoute, icon: Icons.Dashboard, titleId: 'Dashboard', disabled: true },
      { href: chartsRoute, icon: Icons.LineChart, titleId: 'Charts', disabled: true, authorizedOnly: true },
    ],
  },
  {
    titleId: 'Options',
    items: [
      { href: settingsRoute, icon: Icons.Settings, titleId: 'Settings' },
      // { href: rootRoute, icon: Icons.Home, titleId: 'Homepage' },
      // { href: rootRoute, icon: Icons.BookOpen, titleId: 'Documentation', disabled: true },
      { href: rootRoute, icon: Icons.Messages, titleId: 'Support', disabled: true },
    ],
  },
];
