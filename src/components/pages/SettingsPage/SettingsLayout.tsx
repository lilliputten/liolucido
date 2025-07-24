import { getTranslations, setRequestLocale } from 'next-intl/server';

import { constructMetadata } from '@/lib/utils';
import { TAwaitedLocaleProps } from '@/i18n/types';

import { PageHeader } from '../shared';
import { SettingsPageWrapper } from './SettingsPageWrapper';

type TAwaitedProps = TAwaitedLocaleProps;

type TSettingsLayoutProps = TAwaitedProps & {
  children: React.ReactNode;
  selectLanguageModal: React.ReactNode; // A slot from @selectLanguageModal
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
    selectLanguageModal, // A slot from @selectLanguageModal
    params,
  } = props;
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: 'SettingsPage' });

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <SettingsPageWrapper>
      <PageHeader
        heading={t('title')}
        text={t('description')}
        // Test themes
        className="text-theme-500"
      />
      {children}
      {selectLanguageModal}
    </SettingsPageWrapper>
  );
}
