import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { getCurrentUser } from '@/lib/session';
import { constructMetadata } from '@/lib/utils';
import { dataRoute, welcomeRoute } from '@/constants/routes';
import { TAwaitedLocaleProps } from '@/i18n/types';

export async function generateMetadata({ params }: TAwaitedLocaleProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'RootPage' });
  return constructMetadata({
    title: t('title'),
    locale,
  });
}

export async function RootPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(welcomeRoute);
  } else {
    redirect(dataRoute);
  }
}
