import { TUserRole } from '@/shared/types/db/TUserRole';
import { Icons } from '@/components/shared/icons';
import { TRoutePath } from '@/i18n/routing';

export type NavItem = {
  // title: string;
  titleId: string; // Id for i18n
  href: TRoutePath;
  badge?: number;
  disabled?: boolean;
  external?: boolean;
  userRequiredOnly?: boolean;
  authorizedOnly?: TUserRole;
  icon?: keyof typeof Icons;
};

export type MainNavItem = NavItem;

export type MarketingConfig = {
  mainNav: MainNavItem[];
};

export type SidebarNavItem = {
  titleId: string;
  items: NavItem[];
  authorizedOnly?: TUserRole;
  icon?: keyof typeof Icons;
};
