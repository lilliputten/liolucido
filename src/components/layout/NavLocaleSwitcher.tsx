'use client';

import React from 'react';
import { useLocale, useTranslations } from 'next-intl';

import { TPropsWithClassName } from '@/shared/types/generic';
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
import { TLocale } from '@/i18n/types';

interface TNavLocaleSwitcherProps extends TPropsWithClassName {
  onPrimary?: boolean;
  onSidebar?: boolean;
}

export function NavLocaleSwitcher(props: TNavLocaleSwitcherProps) {
  const { onPrimary, onSidebar, className } = props;
  const t = useTranslations('NavLocaleSwitcher');
  const tNavLocaleSwitcher = useTranslations('NavLocaleSwitcher');

  // NOTE: This one doesn't change on real locale change
  const locale = useLocale();

  const [isPending, startTransition] = React.useTransition();

  const { setLocale } = useSettingsContext();

  function onSelectChange(event: React.MouseEvent<HTMLDivElement>) {
    const target = event.currentTarget as HTMLDivElement;
    const { dataset } = target;
    const nextLocale = dataset.locale as TLocale;
    // TODO: Set locale in settings
    startTransition(async () => {
      await setLocale(nextLocale);
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={onPrimary ? 'ghostOnTheme' : 'ghost'}
          size="sm"
          className={cn(
            isDev && '__NavLocaleSwitcher', // DEBUG
            isPending && 'transition-opacity [&:disabled]:opacity-30',
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
      <DropdownMenuContent align={onSidebar ? 'start' : 'end'}>
        {routing.locales.map((cur) => (
          <DropdownMenuItem
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
