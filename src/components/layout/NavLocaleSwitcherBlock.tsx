'use client';

import React from 'react';
import { useLocale, useTranslations } from 'next-intl';

import { TPropsWithClassName } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { isDev } from '@/constants';
import { useSettingsContext } from '@/contexts/SettingsContext';
import { routing } from '@/i18n/routing';

import { SidebarMenuItem, SidebarWrapper, TSidebarBlockProps } from './SidebarComponents';

export function NavLocaleSwitcherBlock(props: TSidebarBlockProps) {
  const { onSidebar, className, align } = props;
  const t = useTranslations('NavLocaleSwitcher');

  const Wrapper = onSidebar ? SidebarWrapper : DropdownMenuContent;
  const MenuItem = onSidebar ? SidebarMenuItem : DropdownMenuItem;

  // NOTE: This one doesn't change on real locale change
  const locale = useLocale();

  const { setLocale } = useSettingsContext();

  return (
    <Wrapper
      data-locale={locale}
      align={align}
      className={cn(
        isDev && '__NavLocaleSwitcherBlock', // DEBUG
        onSidebar && 'flex-row',
        className,
      )}
    >
      {routing.locales.map((cur) => (
        <MenuItem
          key={cur}
          data-locale={cur}
          onSelect={() => setLocale(cur)}
          disabled={cur === locale}
          className={cn(
            isDev && '__NavLocaleSwitcherBlock_MenuItem', // DEBUG
            'flex cursor-pointer items-center gap-1 rounded-sm px-2 py-1.5 text-sm hover:bg-theme-500 hover:text-white',
          )}
        >
          <span>{t('locale', { locale: cur })}</span>
        </MenuItem>
      ))}
    </Wrapper>
  );
}
