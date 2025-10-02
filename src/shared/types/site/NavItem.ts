import { TUserRole } from '@/shared/types/db/TUserRole';
import { TRoutePath } from '@/config/routesConfig';
import { Icons } from '@/components/shared/Icons';

export interface NavItemBase {
  titleId: string; // Id for i18n
  authorizedOnly?: TUserRole | boolean;
  icon?: keyof typeof Icons;
}
export interface NavItem extends NavItemBase {
  href: TRoutePath;
  badge?: number;
  disabled?: boolean;
  external?: boolean;
  userRequiredOnly?: boolean;
}

export type MainNavItem = NavItem;

export type MarketingConfig = {
  mainNav: MainNavItem[];
};

export interface SidebarNavItem extends NavItemBase {
  items: NavItem[];
}
