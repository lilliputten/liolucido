'use client';

import { LayoutDashboard, LogOut, Settings } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import { TPropsWithClassName } from '@/shared/types/generic';
import { settingsRoute } from '@/config/routesConfig';
import { cn } from '@/lib/utils';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Icons } from '@/components/shared/icons';
import { UserAvatar } from '@/components/shared/user-avatar';
import { isDev } from '@/constants';
import { Link } from '@/i18n/routing';

interface TNavUserBlockProps extends TPropsWithClassName {
  onPrimary?: boolean;
  onSidebar?: boolean;
  align?: 'center' | 'end' | 'start';
  closeOuterMenu?: () => void;
}

function SidebarWrapper(props: TNavUserBlockProps & { children: React.ReactNode }) {
  const {
    // onPrimary,
    // onSidebar,
    // align,
    className,
    children,
  } = props;
  return (
    <div
      className={cn(
        isDev && '__NavUserBlock_SidebarWrapper', // DEBUG
        'flex flex-col gap-2',
        className,
      )}
    >
      {children}
    </div>
  );
}
function SidebarMenuItem(
  props: TNavUserBlockProps & { children: React.ReactNode; asChild?: boolean },
) {
  const {
    // onPrimary,
    // onSidebar,
    // align,
    className,
    children,
  } = props;
  return <div className={className}>{children}</div>;
}

export function NavUserBlock(props: TNavUserBlockProps) {
  const {
    // onPrimary,
    onSidebar,
    className,
    align,
    closeOuterMenu,
  } = props;
  const { data: session } = useSession();
  const user = session?.user;
  const t = useTranslations('NavUserAccount');

  if (!user) {
    return null;
  }

  const Wrapper = onSidebar ? SidebarWrapper : DropdownMenuContent;
  const MenuItem = onSidebar ? SidebarMenuItem : DropdownMenuItem;

  const isAdmin = user.role === 'ADMIN';

  return (
    <Wrapper
      align={align}
      className={cn(
        isDev && '__NavUserBlock', // DEBUG
        className,
      )}
    >
      <div
        className={cn(
          isDev && '__NavUserBlock_UserName', // DEBUG
          'flex items-center justify-start gap-3',
          !onSidebar && 'px-2',
        )}
      >
        {onSidebar && (
          <UserAvatar
            user={{ name: user.name || null, image: user.image || null }}
            className={cn(
              isDev && '__NavUserBlock_UserAvatar', // DEBUG
              className,
              'size-8 rounded-full bg-theme-300/25',
              isAdmin && 'border-2 border-solid border-lime-400', // Indicate admin role
              onSidebar && 'flex',
            )}
          />
        )}
        <div className="flex flex-col space-y-1 leading-none">
          <p
            className="flex items-center gap-2 font-medium"
            title={isAdmin ? 'Is Administrator' : undefined}
          >
            {user.name || 'anonymous'}
            {isAdmin && <Icons.ShieldAlert className="size-4 opacity-50" />}
          </p>
          {user.email && (
            <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
          )}
        </div>
      </div>

      <DropdownMenuSeparator />

      {/*isAdmin && (
      <MenuItem asChild>
        <Link
          href="/admin"
          className={cn(
            'flex items-center space-x-2.5',
            'disabled', // UNUSED
          )}
        >
          <Lock className="size-4" />
          <p className="text-sm">{t('Admin')}</p>
        </Link>
      </MenuItem>
      )*/}

      {!onSidebar && (
        <>
          <MenuItem asChild>
            <Link
              href="/" // dashboard
              className={cn(
                'flex items-center space-x-2.5',
                'disabled', // UNUSED
              )}
            >
              <LayoutDashboard className="size-4" />
              <p className="text-sm">{t('Dashboard')}</p>
            </Link>
          </MenuItem>

          <MenuItem asChild>
            <Link
              href={settingsRoute}
              className={cn(
                'flex items-center space-x-2.5',
                // 'disabled', // UNUSED
              )}
            >
              <Settings className="size-4" />
              <p className="text-sm">{t('Settings')}</p>
            </Link>
          </MenuItem>

          <DropdownMenuSeparator />
        </>
      )}

      <MenuItem
        className="cursor-pointer"
        onSelect={(event) => {
          event.preventDefault();
          closeOuterMenu?.();
          signOut({
            callbackUrl: `${window.location.origin}/`,
          });
        }}
      >
        <div className="flex items-center space-x-2.5">
          <LogOut className="size-4" />
          <p className="text-sm">{t('Log out')}</p>
        </div>
      </MenuItem>
    </Wrapper>
  );
}
