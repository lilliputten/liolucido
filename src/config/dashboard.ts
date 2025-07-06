import { UserRoles } from '@/shared/types/db/TUserRole';
import { SidebarNavItem } from '@/shared/types/site/NavItem';

export const sidebarLinks: SidebarNavItem[] = [
  /*
   * {
   *   titleId: 'Your Data',
   *   items: [
   *     { href: '/dashboard/languages', icon: 'lineChart', titleId: 'Languages' },
   *     { href: '/dashboard/wordsSets', icon: 'lineChart', titleId: 'Words sets' },
   *     { href: '/dashboard/words', icon: 'lineChart', titleId: 'Words lists' },
   *   ],
   * },
   */
  {
    titleId: 'Application',
    items: [
      {
        href: '/admin',
        icon: 'laptop',
        titleId: 'Admin Panel',
        authorizedOnly: UserRoles.ADMIN,
      },
      { href: '/dashboard', icon: 'dashboard', titleId: 'Dashboard' },
      {
        href: '/dashboard/billing',
        icon: 'billing',
        titleId: 'Billing',
        authorizedOnly: UserRoles.USER,
      },
      { href: '/dashboard/charts', icon: 'lineChart', titleId: 'Charts' },
      {
        href: '/admin/orders',
        icon: 'package',
        titleId: 'Orders',
        badge: 2,
        authorizedOnly: UserRoles.ADMIN,
      },
      {
        href: '/dashboard/posts',
        icon: 'post',
        titleId: 'User Posts',
        authorizedOnly: UserRoles.USER,
        disabled: true,
      },
    ],
  },
  {
    titleId: 'Options',
    items: [
      { href: '/dashboard/settings', icon: 'settings', titleId: 'Settings' },
      { href: '/', icon: 'home', titleId: 'Homepage' },
      { href: '/docs', icon: 'bookOpen', titleId: 'Documentation' },
      {
        href: '/',
        icon: 'messages',
        titleId: 'Support',
        authorizedOnly: UserRoles.USER,
        disabled: true,
      },
    ],
  },
];
