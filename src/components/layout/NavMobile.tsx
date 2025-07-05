'use client';

import React from 'react';
import { useSelectedLayoutSegment } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { siteMenu } from '@/config/siteMenu';
import { commonXMarginTwStyle } from '@/config/ui';
import { getAllRouteSynonyms } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { NavUserAuthButton } from '@/components/layout/NavAuthButton';
import { NavLocaleSwitcher } from '@/components/layout/NavLocaleSwitcher';
import { NavModeToggle } from '@/components/layout/NavModeToggle';
import { isDev } from '@/constants';
import { Link, usePathname } from '@/i18n/routing';
import { TLocale } from '@/i18n/types';

interface NavMobileProps {
  isUser: boolean;
  isUserRequired: boolean;
}

export function NavMobile(props: NavMobileProps) {
  const { isUser, isUserRequired } = props;
  const [open, setOpen] = React.useState(false);
  const selectedLayout = useSelectedLayoutSegment();
  const isDocs = selectedLayout === 'docs';

  const t = useTranslations('SiteMenu');

  const locale = useLocale() as TLocale;
  const pathname = decodeURI(usePathname());

  const links = siteMenu.mainNav;
  const hasLinks = !!links?.length;

  // prevent body scroll when modal is open
  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : 'auto';
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          isDev && '__NavMobile', // DEBUG
          'fixed',
          'right-3',
          'top-3.5',
          'z-50',
          'rounded-full',
          'p-2',
          commonXMarginTwStyle,
          'transition-colors',
          'duration-200',
          'text-primary-foreground hover:bg-primary-400/50',
          'focus:outline-none',
          'active:bg-primary-300',
          'md:hidden',
          open && 'hover:bg-primary-400',
        )}
      >
        {open ? (
          <X className="size-5 text-primary-foreground" />
        ) : (
          <Menu className="size-5 text-primary-foreground" />
        )}
      </button>

      <nav
        className={cn(
          isDev && '__NavMobile', // DEBUG
          'fixed',
          'inset-0',
          'z-20',
          'hidden',
          'w-full',
          'overflow-auto',
          'bg-background',
          'px-5',
          'pb-5',
          'pt-32',
          'lg:hidden',
          // Forcibly hide on wider screens (over max-md)
          open && 'max-md:block',
        )}
      >
        <ul className="grid divide-y divide-muted">
          {hasLinks &&
            links
              .filter((item) => !isUserRequired || !item.userRequiredOnly || isUser)
              .map((item) => {
                // Check if it's current item using `getAllRouteSynonyms(item.href, locale)`
                const allHrefs = getAllRouteSynonyms(item.href, locale);
                const isCurrent = allHrefs.includes(pathname);
                const isDisabled = !!item.disabled || isCurrent;
                return (
                  <li key={'navbar-' + item.href} className="py-3">
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        // prettier-ignore
                        'flex font-medium capitalize',
                        isCurrent && 'underline',
                        isDisabled && 'disabled',
                      )}
                    >
                      <Button
                        //
                        variant="ghost"
                      >
                        {t(item.titleId)}
                      </Button>
                    </Link>
                  </li>
                );
              })}
        </ul>

        {isDocs ? <div className="mt-8 block md:hidden">DocsSidebarNav</div> : null}

        <div className="mt-5 flex items-center space-x-4">
          {/* TODO: Put github link to the footer
          <Link
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
            className={cn('hover:bg-accent hover:text-accent-foreground')}
          >
            <Icons.github className="size-6" />
            <span className="sr-only">GitHub</span>
          </Link>
          */}
          <NavModeToggle />
          <NavLocaleSwitcher />
          <NavUserAuthButton />
        </div>
      </nav>
    </>
  );
}
