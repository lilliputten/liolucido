import { getTranslations, setRequestLocale } from 'next-intl/server';

import { constructMetadata } from '@/lib/utils';
// import { SettingsContextProvider } from '@/contexts/SettingsContext/SettingsContext';
// import { getAllUsersSettings, getThisUserSettings } from '@/features/settings/actions';
// import { TSettings } from '@/features/settings/types';
import { TAwaitedLocaleProps } from '@/i18n/types';

import { PageHeader } from '../shared';
import { SettingsPageWrapper } from './SettingsPageWrapper';

type TAwaitedProps = TAwaitedLocaleProps;

type TSettingsLayoutProps = TAwaitedProps & {
  children: React.ReactNode;
  // addTopicModal: React.ReactNode; // slot from @addTopicModal
  // deleteTopicModal: React.ReactNode; // slot from @deleteTopicModal
};

export async function generateMetadata({ params }: TAwaitedProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'SettingsPage' });
  const title = t('title');
  const description = t('description');
  return constructMetadata({
    locale,
    title,
    description,
  });
}

export async function SettingsLayout(props: TSettingsLayoutProps) {
  const {
    children,
    // addTopicModal, // slot from @addTopicModal
    // deleteTopicModal, // slot from @deleteTopicModal
    params,
  } = props;
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: 'SettingsPage' });

  // Enable static rendering
  setRequestLocale(locale);

  /*
   * const settingsPromise = isAdminMode ? getAllUsersSettings() : getThisUserSettings();
   * const settings: TSettings[] = (await settingsPromise) || [];
   */

  return (
    <>
      {/* <SettingsContextProvider
      settings={settings}
      namespace={namespace}
      manageScope={scope}
      routePath={routePath}
    > */}
      <SettingsPageWrapper>
        <PageHeader heading={t('title')} text={t('description')} />
        {children}
        {/* {addTopicModal}
        {deleteTopicModal} */}
      </SettingsPageWrapper>
      {/* </SettingsContextProvider> */}
    </>
  );
}
