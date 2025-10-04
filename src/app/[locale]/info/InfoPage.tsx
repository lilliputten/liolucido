import { getTranslations, setRequestLocale } from 'next-intl/server';

import { constructMetadata } from '@/lib/constructMetadata';
import { getCurrentUser } from '@/lib/session';
import { cn } from '@/lib/utils';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { InfoScreen } from '@/components/screens/InfoScreen';
import { isDev } from '@/constants';
import { checkIfUserExists } from '@/features/users/actions/checkIfUserExists';
import { TAwaitedLocaleProps } from '@/i18n/types';

type TInfoPageProps = TAwaitedLocaleProps;

export async function generateMetadata({ params }: TAwaitedLocaleProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'InfoPage' });
  return constructMetadata({
    title: t('title'),
    locale,
  });
}

export async function InfoPage({ params }: TInfoPageProps) {
  const { locale } = await params;

  const user = await getCurrentUser();
  const userId = user?.id;
  // Check also if the user really exists in the database>
  const isLoggedUser = !!userId && (await checkIfUserExists(userId));

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <PageWrapper
      id="InfoPage"
      className={cn(
        isDev && '__InfoPage', // DEBUG
      )}
      innerClassName={cn(
        isDev && '__InfoPage_Inner', // DEBUG
        'w-full h-full',
      )}
      scrollable
      // limitWidth
    >
      <InfoScreen
        className={cn(
          isDev && '__InfoPage_InfoScreen', // DEBUG
        )}
        isLoggedUser={isLoggedUser}
      />
    </PageWrapper>
  );
}
