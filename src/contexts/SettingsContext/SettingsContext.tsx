'use client';

import React from 'react';

import { useSessionUser } from '@/hooks/useSessionUser';
import { defaultSettings, settingsSchema, TSettings } from '@/features/settings/types';

import { SettingsContextData } from './SettingsContextDefinitions';

const SettingsContext = React.createContext<SettingsContextData | undefined>(undefined);

// extends Omit<SettingsContextData, 'setInited' | 'setSettings'>
interface SettingsContextProviderProps {
  children: React.ReactNode;
}

// TODO: Incorporate user into settings data and update/clear settings on user change

export function SettingsContextProvider({ children }: SettingsContextProviderProps) {
  const [settings, setSettings] = React.useState<TSettings>({ ...defaultSettings });
  const [inited, setInited] = React.useState(false);

  const user = useSessionUser();
  const userId = user?.id;

  // Load settings
  React.useEffect(() => {
    console.log('[SettingsContext] Load settings: Start', userId);
    if (!userId) {
      // Restore settings from a local storage, if presented (be careful about sensitive data)
      const settingsJson = window.localStorage.getItem('settings');
      if (settingsJson) {
        try {
          const settingsRaw = JSON.parse(settingsJson);
          const settings: TSettings = settingsSchema.parse(settingsRaw);
          console.log('[SettingsContext] Load settings: Parsed local settings', {
            settingsJson,
            settingsRaw,
            settings,
          });
          setSettings(settings);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('[SettingsContext] Can not parse local settings from:', settingsJson, {
            error,
          });
          debugger; // eslint-disable-line no-debugger
        }
      }
    } else {
      // TODO: Get user data from server, using loading sempahor
      console.log('[SettingsContext] Load settings from server for user:', userId);
    }
    setInited(true);
  }, [userId, setInited]);

  const updateLocalSettings = React.useCallback((settings: TSettings) => {
    try {
      const settingsJson = JSON.stringify(settings);
      console.log('[SettingsContext:updateLocalSettings] Updating local settings', {
        settingsJson,
        settings,
      });
      window.localStorage.setItem('settings', settingsJson);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[SettingsContext:updateLocalSettings] Can not save local settings', {
        error,
      });
      debugger; // eslint-disable-line no-debugger
    }
  }, []);

  const saveSettings = React.useCallback(
    (settings: TSettings) => {
      console.log('[SettingsContext:saveSettings] Save settings: Start', inited, userId, settings);
      /* // TODO: Implement server save handler
       * const savePromise = userId ? updateSettings(settings) : Promise.resolve(settings);
       */
      // DEBUG
      const savePromise = new Promise<TSettings>((resolve, _reject) => {
        // setTimeout(reject, 1000, 'Demo error!');
        setTimeout(resolve, 1000, settings);
      });
      return savePromise.then(() => {
        updateLocalSettings(settings);
        setSettings(settings);
        return settings;
      });
    },
    [inited, userId, updateLocalSettings],
  );

  // Save settings
  React.useEffect(() => {
    if (!inited) {
      return;
    }
  }, [inited, userId, settings]);

  const settingsContext = React.useMemo(
    () => ({
      user,
      settings,
      setSettings,
      saveSettings,
      inited,
    }),
    [user, settings, saveSettings, inited],
  );

  return <SettingsContext.Provider value={settingsContext}>{children}</SettingsContext.Provider>;
}

export function useSettingsContext() {
  const context = React.useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettingsContext must be used within SettingsContextProvider');
  }
  return context;
}
