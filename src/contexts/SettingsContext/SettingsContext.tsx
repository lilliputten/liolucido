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

  React.useEffect(() => {
    const isUser = !!userId;
    // console.log('[SettingsContext] Start', isUser, userId);
    if (!isUser) {
      // Restore settings from a local storage, if presented (be careful about sensitive data)
      const settingsJson = window.localStorage.getItem('settings');
      if (settingsJson) {
        try {
          const settingsRaw = JSON.parse(settingsJson);
          const settings: TSettings = settingsSchema.parse(settingsRaw);
          console.log('[SettingsContext] Parsed local settings', {
            settingsJson,
            settingsRaw,
            settings,
          });
          // debugger;
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
      console.log('[SettingsContext] Retrieve settings from server for user:', userId);
    }
    setInited(true);
  }, [userId]);

  const settingsContext = React.useMemo(
    () => ({
      user,
      settings,
      setSettings,
      inited,
    }),
    [user, settings, inited],
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
