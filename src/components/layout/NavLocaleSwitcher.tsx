'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

import { TPropsWithClassName } from '@/shared/types/generic';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { isDev } from '@/constants';
import { routing, usePathname, useRouter } from '@/i18n/routing';
import { TLocale } from '@/i18n/types';

interface TNavLocaleSwitcherProps extends TPropsWithClassName {
  onPrimary?: boolean;
}

export function NavLocaleSwitcher(props: TNavLocaleSwitcherProps) {
  const { onPrimary, className } = props;
  const t = useTranslations('NavLocaleSwitcher');

  // NOTE: This one doesn't change on real locale change
  const locale = useLocale();

  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();

  const [isPending, startTransition] = React.useTransition();

  function onSelectChange(event: React.MouseEvent<HTMLDivElement>) {
    const target = event.currentTarget as HTMLDivElement;
    const { dataset } = target;
    const nextLocale = dataset.locale as TLocale;
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: nextLocale },
      );
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={onPrimary ? 'ghostOnPrimary' : 'ghost'}
          size="sm"
          className={cn(
            isDev && '__NavLocaleSwitcher', // DEBUG
            className,
            isPending && 'transition-opacity [&:disabled]:opacity-30',
          )}
          title={t('label')}
          data-current-locale={locale}
        >
          <span>
            {/* Locale name */}
            {t('locale', { locale })}
          </span>
          <span className="sr-only">{t('label')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {routing.locales.map((cur) => (
          <DropdownMenuItem
            //
            key={cur}
            data-locale={cur}
            onClick={onSelectChange}
            disabled={cur === locale}
          >
            <span>{t('locale', { locale: cur })}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
