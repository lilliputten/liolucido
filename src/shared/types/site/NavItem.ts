import { Icons } from '@/components/shared/icons';
import { TRoutePath } from '@/i18n/routing';

export type NavItem = {
  titleId: string; // Id for i18n
  href: TRoutePath;
  badge?: number;
  disabled?: boolean;
  external?: boolean;
  userRequiredOnly?: boolean;
  // authorizedOnly?: UserRole;
  icon?: keyof typeof Icons;
};

export type MainNavItem = NavItem;
