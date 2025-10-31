'use client';

import React from 'react';
import { useLocale } from 'next-intl';

import { TPropsWithClassName } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/DropdownMenu';
import { isDev } from '@/constants';
import { localeNames, localeSymbols, useT } from '@/i18n';

import { NavLocaleSwitcherBlock } from './NavLocaleSwitcherBlock';

interface TNavLocaleSwitcherProps extends TPropsWithClassName {
  onPrimary?: boolean;
  onSidebar?: boolean;
}

export function NavLocaleSwitcher(props: TNavLocaleSwitcherProps) {
  const { onPrimary, onSidebar, className } = props;
  const t = useT('NavLocaleSwitcher');

  const locale = useLocale();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={onPrimary ? 'ghostOnTheme' : 'ghost'}
          size="sm"
          className={cn(
            isDev && '__NavLocaleSwitcher', // DEBUG
            'flex gap-2',
            className,
          )}
          title={t('label')}
          data-current-locale={locale}
        >
          <span>{localeSymbols[locale]}</span>
          <span>{localeNames[locale]}</span>
          <span className="sr-only">{t('label')}</span>
        </Button>
      </DropdownMenuTrigger>
      <NavLocaleSwitcherBlock align="end" onPrimary={onPrimary} onSidebar={onSidebar} />
    </DropdownMenu>
  );
}
