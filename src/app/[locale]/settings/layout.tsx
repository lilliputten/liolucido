import { setRequestLocale } from 'next-intl/server';

import { TAwaitedLocaleProps } from '@/i18n/types';

import { SettingsPageWrapper } from './SettingsPageWrapper';

type TSettingsLayoutProps = TAwaitedLocaleProps & {
  children: React.ReactNode;
  selectLanguageModal: React.ReactNode; // A slot from @selectLanguageModal
};

export default async function SettingsLayout(props: TSettingsLayoutProps) {
  const {
    children,
    selectLanguageModal, // A slot from @selectLanguageModal
    params,
  } = props;
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <SettingsPageWrapper>
      {children}
      {selectLanguageModal}
    </SettingsPageWrapper>
  );
}
