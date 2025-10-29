'use client';

import { useLocale, useTranslations } from 'next-intl';

import { siteMenu } from '@/config/siteMenu';
import { commonXPaddingTwStyle } from '@/config/ui';
import { getAllRouteSynonyms } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { NavUserAuthButton } from '@/components/layout/NavAuthButton';
import { NavBarBrand } from '@/components/layout/NavBarBrand';
import { NavLocaleSwitcher } from '@/components/layout/NavLocaleSwitcher';
import { NavModeToggle } from '@/components/layout/NavModeToggle';
import * as Icons from '@/components/shared/Icons';
import { isDev } from '@/constants';
import { Link, usePathname } from '@/i18n/routing';
import { TLocale } from '@/i18n/types';

interface NavBarProps {
  large?: boolean;
  isUser: boolean;
  open: boolean;
  setOpen: (p: boolean) => void;
}

export function NavBar(props: NavBarProps) {
  const { isUser, open, setOpen } = props;
  const links = siteMenu.mainNav;
  const t = useTranslations('SiteMenu');
  const locale = useLocale() as TLocale;
  const pathname = decodeURI(usePathname());
  return (
    <header
      className={cn(
        isDev && '__NavBar', // DEBUG
        'sticky',
        'top-0',
        'z-40',
        'flex',
        'w-full',
        'bg-theme-400/70',
        'backdrop-blur',
        commonXPaddingTwStyle,
        'justify-stretch',
        'transition-all',
      )}
    >
      <div // Ex: MaxWidthWrapper
        className={cn(
          isDev && '__NavBar_Decor', // DEBUG
          'absolute inset-0 overflow-hidden',
          'bg-header-gradient',
          'z-0',
        )}
      />
      <div // Ex: MaxWidthWrapper
        className={cn(
          isDev && '__NavBar_Wrapper', // DEBUG
          'flex',
          'w-full',
          'items-center',
          'justify-between',
          'py-2',
          'z-10',
        )}
        // large={large}
      >
        <NavBarBrand isUser={isUser} />

        {links && links.length > 0 ? (
          <nav className="hidden gap-6 md:flex">
            {links
              .filter((item) => !item.userRequiredOnly || isUser)
              .map((item) => {
                // Check if it's current item using `getAllRouteSynonyms(item.href, locale)`
                const allHrefs = getAllRouteSynonyms(item.href, locale);
                const isCurrent = allHrefs.includes(pathname);
                const isDisabled = !!item.disabled || isCurrent;
                return (
                  <Link
                    key={'navbar-' + item.href}
                    href={item.href}
                    prefetch
                    className={cn(
                      'flex',
                      'items-center',
                      'text-lg',
                      'font-medium',
                      'transition-all',
                      'text-theme-foreground/80',
                      'opacity-100',
                      'hover:opacity-80',
                      'sm:text-sm',
                      isCurrent && 'underline',
                      isDisabled && 'disabled',
                    )}
                  >
                    {t(item.titleId)}
                  </Link>
                );
              })}
          </nav>
        ) : null}

        <div
          className={cn(
            isDev && '__NavBar_Right', // DEBUG
            'items-center space-x-3',
            'hidden',
            'md:flex',
          )}
        >
          {/* Right header for extra stuff */}
          <NavModeToggle onPrimary />
          <NavLocaleSwitcher onPrimary />
          <NavUserAuthButton isUser={isUser} onPrimary />
        </div>

        {/* Mobile panel toggler icon */}
        <button
          onClick={() => setOpen(!open)}
          className={cn(
            isDev && '__NavBar_MobilePanelToggler', // DEBUG
            'rounded-full',
            'p-2',
            // commonXMarginTwStyle,
            'transition-all',
            'duration-200',
            'text-theme-foreground hover:bg-theme-400/50',
            'focus:outline-none',
            'active:bg-theme-300',
            'md:hidden',
            open && 'opacity-50 hover:bg-theme-400',
          )}
        >
          <Icons.Menu className="size-5 text-theme-foreground" />
        </button>
      </div>
    </header>
  );
}
