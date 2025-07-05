'use client';

import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

import { TPropsWithChildrenAndClassName } from '@/shared/types/generic';
import { siteConfig } from '@/config/site';
import { getAllRouteSynonyms } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/shared/Logo';
import { isDev } from '@/constants';
import { infoRoute, welcomeRoute } from '@/constants/routes';
import { Link } from '@/i18n/routing';
import { TLocale } from '@/i18n/types';

interface NavBarBrandProps {
  isUser: boolean;
  isUserRequired: boolean;
}

function BrandWrapper(props: TPropsWithChildrenAndClassName & NavBarBrandProps) {
  const {
    isUser,
    // isUserRequired,
    children,
    className: parentClassName,
  } = props;
  const locale = useLocale() as TLocale;
  const pathname = decodeURI(usePathname());
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
  return (
    <BrandWrapper {...props} className="h-12">
      <Logo className="size-8" />
      <h1
        role="heading"
        data-testid="NavBarBrandTitle"
        className={cn(
          'font-urban',
          'text-xl',
          'text-primary-foreground',
          'font-bold',
          'whitespace-nowrap',
          'overflow-hidden',
          'text-ellipsis',
        )}
      >
        {siteConfig.name}
      </h1>
    </BrandWrapper>
  );
}
