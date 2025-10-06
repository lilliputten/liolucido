'use client';

import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

import { defaultSystemTheme, systemThemeIcons, TSystemThemeId } from '@/config/themes';
import { TPropsWithClassName } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import * as Icons from '@/components/shared/Icons';
import { isDev } from '@/constants';
import { useSettingsContext } from '@/contexts/SettingsContext';

import { NavModeToggleBlock } from './NavModeToggleBlock';

interface TNavModeToggleProps extends TPropsWithClassName {
  onPrimary?: boolean;
  onSidebar?: boolean;
}

export function NavModeToggle(props: TNavModeToggleProps) {
  const { onPrimary, onSidebar, className } = props;
  const t = useTranslations('NavModeToggle');
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild aria-label={t('label')}>
        <Button
          variant={onPrimary ? 'ghostOnTheme' : 'ghost'}
          size="sm"
          className={cn(
            isDev && '__NavModeToggle', // DEBUG
            'relative size-8 px-0',
            // onSidebar && 'flex justify-start gap-2 px-2',
            className,
          )}
          title={t('label')}
        >
          <Icons.Sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Icons.Moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">{t('label')}</span>
        </Button>
      </DropdownMenuTrigger>
      <NavModeToggleBlock align="end" onPrimary={onPrimary} onSidebar={onSidebar} />
    </DropdownMenu>
  );
}
