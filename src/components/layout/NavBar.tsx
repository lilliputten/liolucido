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
import { MaxWidthWrapper } from '@/components/shared/MaxWidthWrapper';
import { isDev } from '@/constants';
import { Link, usePathname } from '@/i18n/routing';
import { TLocale } from '@/i18n/types';

interface NavBarProps {
  large?: boolean;
  isUser: boolean;
  isUserRequired: boolean;
}

export function NavBar(props: NavBarProps) {
  const { large, isUser, isUserRequired } = props;
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
        'bg-primary',
        commonXPaddingTwStyle,
        'justify-center',
        'transition-all',
      )}
    >
      <MaxWidthWrapper
        className={cn(
          // prettier-ignore
          'flex',
          'items-center',
          'justify-between',
          'py-2',
          'z-10',
        )}
        large={large}
      >
        <div className="flex gap-6 md:gap-10">
          <NavBarBrand isUser={isUser} isUserRequired={isUserRequired} />
          {links && links.length > 0 ? (
            <nav className="hidden gap-6 md:flex">
              {links
                .filter((item) => !isUserRequired || !item.userRequiredOnly || isUser)
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
                        'text-primary-foreground/80',
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
        </div>

        <div
          className={cn(
            isDev && '__NavBar_Right', // DEBUG
            'items-center space-x-3',
            'hidden',
            'md:flex',
          )}
        >
          {/* Right header for extra stuff */}
          {/* TODO: Put github link to the footer
          <Link
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
            className={cn(
              'inline-flex',
              'items-center',
              'justify-center',
              'size-8 rounded-sm px-0',
              'text-primary-foreground hover:bg-primary-400/50',
            )}
          >
            <Icons.github className="size-6" />
            <span className="sr-only">GitHub</span>
          </Link>
          <NavTgSignInButton />
          */}
          <NavModeToggle onPrimary />
          <NavLocaleSwitcher onPrimary />
          <NavUserAuthButton onPrimary />
        </div>
      </MaxWidthWrapper>
    </header>
  );
}
