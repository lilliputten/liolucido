'use client';

import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

import { defaultSystemTheme, systemThemeIcons, TSystemThemeId } from '@/config/themes';
import { cn } from '@/lib/utils';
import { DropdownMenuContent, DropdownMenuItem } from '@/components/ui/DropdownMenu';
import { isDev } from '@/config';
import { useSettingsContext } from '@/contexts/SettingsContext';

import { SidebarMenuItem, SidebarWrapper, TSidebarBlockProps } from './SidebarComponents';

export function NavModeToggleBlock(props: TSidebarBlockProps) {
  const { onSidebar, className, align } = props;
  const Wrapper = onSidebar ? SidebarWrapper : DropdownMenuContent;
  const MenuItem = onSidebar ? SidebarMenuItem : DropdownMenuItem;
  const { theme: currentTheme = defaultSystemTheme, themes } = useTheme();
  const { setTheme } = useSettingsContext();
  const t = useTranslations('NavModeToggle');
  return (
    <Wrapper
      data-theme={currentTheme}
      align={align}
      className={cn(
        isDev && '__NavModeToggleBlock', // DEBUG
        onSidebar && 'flex-row',
        className,
      )}
    >
      {themes.map((thisTheme) => {
        const ThemeIcon = systemThemeIcons[thisTheme as TSystemThemeId];
        return (
          <MenuItem
            key={thisTheme}
            className={cn(
              isDev && '__NavModeToggleBlock_MenuItem', // DEBUG
              'flex cursor-pointer items-center gap-1 rounded-sm px-2 py-1.5 text-sm',
            )}
            disabled={thisTheme === currentTheme}
            onSelect={() => setTheme(thisTheme)}
          >
            {ThemeIcon && <ThemeIcon className="mr-2 size-4" />}
            <span>{t(thisTheme)}</span>
          </MenuItem>
        );
      })}
    </Wrapper>
  );
}
