'use client';

import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

import { TPropsWithClassName } from '@/shared/types/generic';
import { defaultSystemTheme, systemThemeIcons, TSystemThemeId } from '@/config/themes';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { isDev } from '@/constants';
import { useSettingsContext } from '@/contexts/SettingsContext';

import { Icons } from '../shared/icons';

interface TNavModeToggleProps extends TPropsWithClassName {
  onPrimary?: boolean;
  onSidebar?: boolean;
}

export function NavModeToggle(props: TNavModeToggleProps) {
  const {
    onPrimary,
    //  onSidebar,
    className,
  } = props;
  const {
    theme: currentTheme = defaultSystemTheme,
    themes,
    // setTheme: setAppTheme,
  } = useTheme();
  // const ThemeIcon = systemThemeIcons[currentTheme as TSystemThemeId];
  const { setTheme } = useSettingsContext();
  const t = useTranslations('NavModeToggle');
  const handleThemeChange = (theme: string) => {
    // setAppTheme(theme);
    setTheme(theme);
  };
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
          <Icons.sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Icons.moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">{t('label')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((thisTheme) => {
          const ThemeIcon = systemThemeIcons[thisTheme as TSystemThemeId];
          return (
            <DropdownMenuItem
              key={thisTheme}
              onClick={() => handleThemeChange(thisTheme)}
              disabled={thisTheme === currentTheme}
            >
              {ThemeIcon && <ThemeIcon className="mr-2 size-4" />}
              <span>{t(thisTheme)}</span>
            </DropdownMenuItem>
          );
        })}
        {/*
        <DropdownMenuArrow />
        */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
