import { getTranslations, setRequestLocale } from 'next-intl/server';

import { cn, constructMetadata } from '@/lib/utils';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { WelcomeScreen } from '@/components/screens/WelcomeScreen';
import { isDev } from '@/constants';
import { TAwaitedLocaleProps } from '@/i18n/types';

type TWelcomePageProps = TAwaitedLocaleProps;

export async function generateMetadata({ params }: TAwaitedLocaleProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'WelcomePage' });
  return constructMetadata({
    title: t('title'),
    locale,
  });
}

export async function WelcomePage({ params }: TWelcomePageProps) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <PageWrapper
      id="WelcomePage"
      className={cn(
        isDev && '__WelcomePage', // DEBUG
      )}
      innerClassName={cn(
        isDev && '__WelcomePage_Inner', // DEBUG
        'w-full',
      )}
      scrollable
      // limitWidth
    >
      <WelcomeScreen
        className={cn(
          isDev && '__WelcomePage_WelcomeScreen', // DEBUG
        )}
      />
    </PageWrapper>
  );
}
