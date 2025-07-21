import { TSettings } from '@/features/settings/types';
import { TExtendedUser } from '@/features/users/types/TUser';

export interface SettingsContextData {
  user?: TExtendedUser;
  settings: TSettings;
  setSettings: React.Dispatch<React.SetStateAction<TSettings>>;
  inited: boolean;
  // setInited: React.Dispatch<React.SetStateAction<boolean>>;
}
