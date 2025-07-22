'use client';

import React from 'react';
import { toast } from 'sonner';

import { removeFalsyValues, removeNullUndefinedValues } from '@/lib/helpers/objects';
import { getSettings, updateSettings } from '@/features/settings/actions';
import { defaultSettings, settingsSchema, TSettings } from '@/features/settings/types';
import { TDefinedUserId } from '@/features/users/types/TUser';

import { SettingsContextData } from './SettingsContextDefinitions';

const SettingsContext = React.createContext<SettingsContextData | undefined>(undefined);

interface SettingsContextProviderProps {
  children: React.ReactNode;
  userId?: TDefinedUserId;
}

export function SettingsContextProvider({ children, userId }: SettingsContextProviderProps) {
  const [settings, setSettings] = React.useState<TSettings>({ ...defaultSettings });
  const [inited, setInited] = React.useState(false);
  const [userInited, setUserInited] = React.useState(false);

  // TODO: To use on user logout
  const resetLocalSettings = React.useCallback(
    () => window.localStorage.removeItem('settings'),
    [],
  );

  // Set local settings
  const updateLocalSettings = React.useCallback((settings: TSettings) => {
    try {
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

  // Load settings
  React.useEffect(() => {
    if (!userId) {
      // Restore settings from a local storage, if presented (be careful about sensitive data)
      const settingsJson = window.localStorage.getItem('settings');
      if (settingsJson) {
        try {
          const rawSettings = JSON.parse(settingsJson);
          const settings: TSettings = settingsSchema.parse(rawSettings);
          setSettings(settings);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('[SettingsContext] Can not parse local settings from:', settingsJson, {
            error,
          });
          debugger; // eslint-disable-line no-debugger
          toast.error('Can not parse local settings data');
        }
      }
    } else {
      // Get user data from server, using loading sempahor
      const promise = getSettings();
      toast.promise(promise, {
        loading: 'Loading settings...',
        success: 'Successfully loaded settings.',
        error: 'Can not load the settings data.',
      });
      promise
        .then((rawSettings) => {
          if (rawSettings && rawSettings.userId === userId) {
            removeNullUndefinedValues(rawSettings);
            const settings: TSettings = settingsSchema.parse(rawSettings);
            setSettings(settings);
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
        });
    }
    setInited(true);
  }, [userId]);

  /** Save settings on the server (if user authorized) and locally */
  const saveSettings = React.useCallback(
    (settings: TSettings) => {
      const savePromise = userId ? updateSettings(settings) : Promise.resolve(settings);
      /* // DEBUG
       * const savePromise = new Promise<TSettings>((resolve, _reject) => {
       *   // setTimeout(reject, 1000, 'Demo error!');
       *   setTimeout(resolve, 1000, settings);
       * });
       */
      return savePromise.then(() => {
        updateLocalSettings(settings);
        setSettings(settings);
        return settings;
      });
    },
    [userId, updateLocalSettings],
  );

  // Save settings
  React.useEffect(() => {
    if (!inited) {
      return;
    }
  }, [inited, userId, settings]);

  const settingsContext = React.useMemo(
    () => ({
      userId,
      settings,
      setSettings,
      saveSettings,
      resetLocalSettings,
      inited,
      userInited,
    }),
    [userId, settings, saveSettings, resetLocalSettings, inited, userInited],
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
