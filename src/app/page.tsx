import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { availableTopicsRoute, welcomeRoute } from '@/config/routesConfig';
import { constructMetadata } from '@/lib/constructMetadata';
import { getCurrentUser } from '@/lib/session';
import { defaultLocale, TAwaitedLocaleProps } from '@/i18n/types';

export async function generateMetadata({ params }: TAwaitedLocaleProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'RootPage' });
  return constructMetadata({
    title: t('title'),
    locale,
  });
}

// This page only renders when the app is built statically (output: 'export')
export default async function DefaultRootPage() {
  const prefix = '/' + defaultLocale;
  const user = await getCurrentUser();
  const route = user ? availableTopicsRoute : welcomeRoute;
  redirect(prefix + route);
}
