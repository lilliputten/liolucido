import { TSettings } from '@/features/settings/types';
import { TExtendedUser } from '@/features/users/types/TUser';

export interface SettingsContextData {
  /** Current user */
  user?: TExtendedUser;
  /** The settings data */
  settings: TSettings;
  /** Set settings in the context */
  setSettings: (settings: TSettings) => void; // React.Dispatch<React.SetStateAction<TSettings>>;
  /** Save settings on the server (if user authorized) and locally */
  saveSettings: (settings: TSettings) => Promise<TSettings>; // React.Dispatch<React.SetStateAction<TSettings>>;
  /** Reset locally saved settings (on user logout, as a case) */
  resetLocalSettings: () => void;
  /** The settings data has been initialized and is ready to use */
  inited: boolean;
}
