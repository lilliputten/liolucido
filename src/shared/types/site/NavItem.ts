import { TUserRole } from '@/shared/types/db/TUserRole';
import { TRoutePath } from '@/config/routesConfig';
import { Icons } from '@/components/shared/icons';

export type NavItem = {
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
