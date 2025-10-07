'use client';

import React from 'react';
import { useLocale, useTranslations } from 'next-intl';

import { TPropsWithClassName } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/DropdownMenu';
import { isDev } from '@/constants';

import { NavLocaleSwitcherBlock } from './NavLocaleSwitcherBlock';

interface TNavLocaleSwitcherProps extends TPropsWithClassName {
  onPrimary?: boolean;
  onSidebar?: boolean;
}

export function NavLocaleSwitcher(props: TNavLocaleSwitcherProps) {
  const { onPrimary, onSidebar, className } = props;
  const t = useTranslations('NavLocaleSwitcher');
  const tNavLocaleSwitcher = useTranslations('NavLocaleSwitcher');

  const locale = useLocale();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={onPrimary ? 'ghostOnTheme' : 'ghost'}
          size="sm"
          className={cn(
            isDev && '__NavLocaleSwitcher', // DEBUG
            // isPending && 'transition-opacity [&:disabled]:opacity-30',
            // onSidebar && 'flex justify-start gap-2 px-2',
            className,
          )}
          title={t('label')}
          data-current-locale={locale}
        >
          <span>
            {/* Locale name */}
            {tNavLocaleSwitcher('locale', { locale })}
          </span>
          <span className="sr-only">{t('label')}</span>
        </Button>
      </DropdownMenuTrigger>
      <NavLocaleSwitcherBlock align="end" onPrimary={onPrimary} onSidebar={onSidebar} />
    </DropdownMenu>
  );
}
