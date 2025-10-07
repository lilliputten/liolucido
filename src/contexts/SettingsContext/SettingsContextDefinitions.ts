// import { TDefinedUserId } from '@/features/users/types/TUser';
import { ExtendedUser } from '@/@types/next-auth';

import { TApiResponse } from '@/lib/types/api';
import { TSettings } from '@/features/settings/types';

export interface SettingsContextData {
  /** Current user */
  user?: ExtendedUser;
  /** The settings data */
  settings: TSettings;
  setLocale: (locale: TSettings['locale']) => Promise<TSettings>;
  setTheme: (theme: TSettings['theme']) => Promise<TSettings>;
  /** Load settings from the server */
  loadSettings: () => Promise<TSettings | undefined>;
  /** Set settings in the context */
  // setSettings: (settings: TSettings) => void; // React.Dispatch<React.SetStateAction<TSettings>>;
  /** Save settings on the server (if user authorized) and locally */
  updateAndSaveSettings: (
    settings: TSettings,
  ) => Promise<TApiResponse<TSettings> | { ok: true; data: TSettings }>; // React.Dispatch<React.SetStateAction<TSettings>>;
  /** Reset locally saved settings (on user logout, as a case) */
  resetLocalSettings: () => void;
  /** User data has been loaded */
  userInited: boolean;
  /** The settings data has been initialized and is ready to use */
  inited: boolean;
  /** The settings are completely ready */
  ready: boolean;
}
