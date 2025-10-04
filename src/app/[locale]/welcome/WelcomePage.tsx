import { getTranslations, setRequestLocale } from 'next-intl/server';

import { constructMetadata } from '@/lib/constructMetadata';
import { getCurrentUser } from '@/lib/session';
import { cn } from '@/lib/utils';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { WelcomeScreen } from '@/components/screens/WelcomeScreen';
import { isDev } from '@/constants';
import { checkIfUserExists } from '@/features/users/actions/checkIfUserExists';
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

  const user = await getCurrentUser();
  const userId = user?.id;
  // Check also if the user really exists in the database>
  const isLoggedUser = !!userId && (await checkIfUserExists(userId));

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
        'w-full h-full',
      )}
      scrollable
      // limitWidth
    >
      <WelcomeScreen
        className={cn(
          isDev && '__WelcomePage_WelcomeScreen', // DEBUG
        )}
        isLoggedUser={isLoggedUser}
      />
    </PageWrapper>
  );
}
