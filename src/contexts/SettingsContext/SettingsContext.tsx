'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';

import { defaultThemeColor } from '@/config/themeColors';
import { deleteCookie, setCookie } from '@/lib/helpers/cookies';
import { removeFalsyValues, removeNullUndefinedValues } from '@/lib/helpers/objects';
import { useSwitchRouterLocale } from '@/hooks/useSwitchRouterLocale';
import { getSettings, updateSettings } from '@/features/settings/actions';
import { defaultSettings, settingsSchema, TSettings } from '@/features/settings/types';
import { TDefinedUserId } from '@/features/users/types/TUser';
import { defaultLocale, TLocale } from '@/i18n/types';

import { SettingsContextData } from './SettingsContextDefinitions';

const SettingsContext = React.createContext<SettingsContextData | undefined>(undefined);

interface SettingsContextProviderProps {
  children: React.ReactNode;
  userId?: TDefinedUserId;
}

function getLocalSettings() {
  const settingsJson = window.localStorage.getItem('settings');
  if (settingsJson) {
    try {
      const rawSettings = JSON.parse(settingsJson);
      const settings: TSettings = settingsSchema.parse(rawSettings);
      return settings;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[SettingsContext] Can not parse local settings from:', settingsJson, {
        error,
      });
      debugger; // eslint-disable-line no-debugger
      // toast.error('Can not parse local settings data');
    }
  }
}

const defaultTheme = 'system';

type TMemo = {
  inited?: boolean;
  settings: TSettings;
  loadingPromise?: Promise<TSettings | undefined>;
  setAppTheme?: React.Dispatch<React.SetStateAction<string>>;
};

export function SettingsContextProvider({ children, userId }: SettingsContextProviderProps) {
  const memo = React.useMemo<TMemo>(() => ({ settings: { ...defaultSettings } }), []);
  const [settings, setSettings] = React.useState<TSettings>(memo.settings);
  const [inited, setInited] = React.useState(false);
  const [userInited, setUserInited] = React.useState(false);
  // const [themeColor, setThemeColor] = React.useState<TThemeColorId>((memo.settings.themeColor || defaultThemeColor) as TThemeColorId);

  const ready = userId ? userInited : inited;

  const themeContext = useTheme();
  memo.setAppTheme = themeContext.setTheme;

  const { switchRouterLocale } = useSwitchRouterLocale();
  const locale = useLocale();

  const updateThemeForNewSettings = React.useCallback(
    (settings: TSettings, force?: boolean) => {
      const isThemeChanged = force || memo.settings.theme !== settings.theme;
      if (isThemeChanged && settings.theme) {
        memo.setAppTheme?.(settings.theme);
      }
    },
    [memo],
  );

  // Update system locale
  React.useEffect(() => {
    const thisLocale = (settings.locale || defaultLocale) as TLocale;
    if (ready && locale !== thisLocale) {
      switchRouterLocale(thisLocale);
    }
  }, [ready, locale, settings.locale, switchRouterLocale]);

  // Update theme color
  React.useEffect(() => {
    const thisThemeColor = settings.themeColor || defaultThemeColor;
    if (ready && thisThemeColor) {
      const html = document.body.parentNode as HTMLElement;
      const dataset = html?.dataset;
      if (dataset) {
        dataset.themeColor = thisThemeColor;
      }
    }
  }, [ready, settings.themeColor]);

  // Set local settings
  const updateLocalSettings = React.useCallback((settings: TSettings) => {
    try {
      // Set cookie
      const { themeColor } = settings;
      // Set cookie to allow providing a colorTheme value in the layout on SSR if no user has been authorized (and no settings), to avoid content flash
      if (themeColor) {
        setCookie('themeColor', themeColor);
      } else {
        deleteCookie('themeColor');
      }
      const settingsData = removeFalsyValues(settings); // { ...settings, userId });
      // Don't store user id locally (but be sure that settings are cleared on logout
      if (settingsData.userId) {
        delete settingsData.userId;
      }
      if (Object.keys(settingsData).length) {
        window.localStorage.setItem('settings', JSON.stringify(settingsData));
      } else {
        window.localStorage.removeItem('settings');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[SettingsContext:updateLocalSettings] Can not save local settings', {
        error,
      });
      debugger; // eslint-disable-line no-debugger
      toast.error('Can not save local settings');
    }
  }, []);

  const setAndMemoizeSettings = React.useCallback(
    (settings: TSettings) => {
      setSettings(settings);
      updateLocalSettings(settings);
      updateThemeForNewSettings(settings);
      memo.settings = settings;
    },
    [memo, updateThemeForNewSettings, updateLocalSettings],
  );

  /** Save settings on the server (if user authorized) and locally */
  const updateAndSaveSettings = React.useCallback(
    (settings: TSettings) => {
      // Save local data and apply the data first
      setAndMemoizeSettings(settings);
      // Then invoke (if authorized) the save procedure on the server
      if (!userId) {
        return Promise.resolve(settings);
      }
      /* // DEBUG
       * return new Promise<TSettings>((resolve) => setTimeout(resolve, 3000, settings));
       */
      const savePromise = updateSettings(settings);
      /* // ALT: Using api route
       * const savePromise = fetch('/api/settings', {
       *   method: 'PUT',
       *   headers: { 'Content-Type': 'application/json' },
       *   body: JSON.stringify(settings),
       * }).then((res) => {
       *   console.log('[SettingsContext:updateAndSaveSettings] done', {
       *     res,
       *   });
       *   if (!res.ok) {
       *     throw new Error(`HTTP ${res.status}`);
       *   }
       *   return res.json();
       * });
       */
      toast.promise(savePromise, {
        loading: 'Saving settings...',
        success: 'Successfully saved settings.',
        error: 'Can not save settings.',
      });
      return savePromise;
    },
    [setAndMemoizeSettings, userId],
  );

  /** Set and save locale */
  const setLocale = React.useCallback(
    (locale: TSettings['locale'] = defaultLocale) => {
      const updatedSettings = { ...memo.settings, locale };
      return updateAndSaveSettings(updatedSettings);
    },
    [memo, updateAndSaveSettings],
  );

  /** Set and save theme */
  const setTheme = React.useCallback(
    (theme: TSettings['theme'] = defaultTheme) => {
      // memo.setAppTheme?.(theme);
      const updatedSettings = { ...memo.settings, theme };
      return updateAndSaveSettings(updatedSettings);
    },
    [memo, updateAndSaveSettings],
  );

  // TODO: To use on user logout
  const resetLocalSettings = React.useCallback(
    () => window.localStorage.removeItem('settings'),
    [],
  );

  const loadSettings = React.useCallback(() => {
    if (memo.loadingPromise) {
      return memo.loadingPromise;
    }
    if (!userId) {
      return Promise.resolve(undefined);
    }
    const promise = getSettings();
    toast.promise(promise, {
      loading: 'Loading settings...',
      success: 'Successfully loaded settings.',
      error: 'Can not load the settings data.',
    });
    memo.loadingPromise = promise;
    promise
      .then((rawSettings) => {
        if (rawSettings && rawSettings.userId === userId) {
          removeNullUndefinedValues(rawSettings);
          const settings: TSettings = settingsSchema.parse(rawSettings);
          setAndMemoizeSettings(settings);
        }
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('[SettingsContext:getSettings] Can not load settings from server', {
          error,
        });
        debugger; // eslint-disable-line no-debugger
        toast.error('Can not load settings from server');
      })
      .finally(() => {
        setUserInited(true);
        delete memo.loadingPromise;
      });
    return promise;
  }, [memo, setAndMemoizeSettings, userId]);

  // Load settings on initialization
  React.useEffect(() => {
    if (!memo.inited) {
      // Restore settings from a local storage, if presented (be careful about sensitive data)
      const settings: TSettings | undefined = getLocalSettings();
      if (settings) {
        setAndMemoizeSettings(settings);
      }
      // Get user data from server, if there is an authentificated user
      setInited(true);
      memo.inited = true;
      loadSettings();
    }
  }, [memo, setAndMemoizeSettings, userId, loadSettings]);

  const settingsContext = React.useMemo<SettingsContextData>(
    () => ({
      userId,
      settings,
      setLocale,
      setTheme,
      // setSettings: setAndMemoizeSettings,
      loadSettings,
      updateAndSaveSettings,
      resetLocalSettings,
      ready,
      inited,
      userInited,
    }),
    [
      userId,
      settings,
      setLocale,
      setTheme,
      // setAndMemoizeSettings,
      loadSettings,
      updateAndSaveSettings,
      resetLocalSettings,
      ready,
      inited,
      userInited,
    ],
  );

  return <SettingsContext.Provider value={settingsContext}>{children}</SettingsContext.Provider>;
}

export function useSettingsContext() {
  const context: SettingsContextData | undefined = React.useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettingsContext must be used within SettingsContextProvider');
  }
  return context;
}
