'use client';

import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

import { TPropsWithClassName } from '@/shared/types/generic';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Icon, Icons } from '@/components/shared/icons';
import { isDev } from '@/constants';

interface TNavModeToggleProps extends TPropsWithClassName {
  onPrimary?: boolean;
}

const themeIcons: Record<string, Icon> = {
  light: Icons.sun,
  dark: Icons.moon,
  system: Icons.laptop,
};

export function NavModeToggle(props: TNavModeToggleProps) {
  const { onPrimary, className } = props;
  const { theme: currentTheme, themes, setTheme } = useTheme();
  const t = useTranslations('NavModeToggle');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild aria-label={t('label')}>
        <Button
          variant={onPrimary ? 'ghostOnPrimary' : 'ghost'}
          size="sm"
          className={cn(
            isDev && '__NavModeToggle', // DEBUG
            className,
            'size-8 px-0',
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
          const ThemeIcon = themeIcons[thisTheme];
          return (
            <DropdownMenuItem
              key={thisTheme}
              onClick={() => setTheme(thisTheme)}
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
