'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useTheme } from 'next-themes';

import { TPropsWithChildrenAndClassName } from '@/shared/types/generic';
import { infoRoute, welcomeRoute } from '@/config/routesConfig';
import { siteConfig } from '@/config/site';
import { getAllRouteSynonyms } from '@/lib/routes';
import { cn } from '@/lib/utils';
import logoSvg from '@/assets/logo/logo-full-line-w.svg';
import logoWhiteSvg from '@/assets/logo/logo-full-line-w.svg';
import { isDev } from '@/constants';
import { Link } from '@/i18n/routing';
import { TLocale } from '@/i18n/types';

interface NavBarBrandProps {
  isUser?: boolean;
}

function BrandWrapper(props: TPropsWithChildrenAndClassName & NavBarBrandProps) {
  const { isUser, children, className: parentClassName } = props;
  const locale = useLocale() as TLocale;
  const pathname = decodeURI(usePathname() || '');
  const rootRoute = isUser ? infoRoute : welcomeRoute;
  const rootRoutesList = getAllRouteSynonyms(rootRoute, locale);
  const isRoot = !pathname || rootRoutesList.includes(pathname);
  const className = cn(
    isDev && '__BrandWrapper', // DEBUG
    parentClassName,
    'flex',
    'items-center',
    'space-x-1.5',
    'gap-2',
    'transition-all',
    'mr-10',
    'select-none',
    !isRoot && 'hover:opacity-80',
  );
  if (isRoot) {
    return <div className={className}>{children}</div>;
  }
  return (
    <Link href={rootRoute} className={className}>
      {children}
    </Link>
  );
}

export function NavBarBrand(props: NavBarBrandProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  return (
    <BrandWrapper {...props} className="h-12">
      {/*
      <Image
        src={logoImageSvg}
        className="h-12 w-auto"
        // width={logoSize}
        // height={logoSize}
        // alt="Logo"
        alt={siteConfig.name}
        // priority={false}
      />
      */}
      <Image
        // src={logoTextSvg}
        src={isDark ? logoWhiteSvg : logoSvg}
        className="h-14 w-auto"
        // width={logoSize}
        // height={32}
        priority={false}
        alt={siteConfig.name}
      />
      {/*

      <h1
        role="heading"
        data-testid="NavBarBrandTitle"
        className={cn(
          'font-urban',
          'text-xl',
          'text-theme-foreground',
          'font-bold',
          'whitespace-nowrap',
          'overflow-hidden',
          'text-ellipsis',
        )}
      >
        {siteConfig.name}
      </h1>
      */}
    </BrandWrapper>
  );
}
