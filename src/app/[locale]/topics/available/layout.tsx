import { setRequestLocale } from 'next-intl/server';

import {
  TopicsContextProvider,
  TopicsManageScopeIds,
  topicsNamespaces,
  topicsRoutes,
  TTopicsManageScopeId,
} from '@/contexts/TopicsContext';
import { getAvailableTopics } from '@/features/topics/actions';
import { TAwaitedLocaleProps } from '@/i18n/types';

type TAwaitedProps = TAwaitedLocaleProps;

type TLayoutProps = TAwaitedProps & {
  children: React.ReactNode;
};

const scope: TTopicsManageScopeId = TopicsManageScopeIds.AVAILABLE_TOPICS;

export default async function AvailableTopicsLayout(props: TLayoutProps) {
  const { children, params } = props;
  const { locale } = await params;

  const namespace = topicsNamespaces[scope];
  const routePath = topicsRoutes[scope];

  // Enable static rendering
  setRequestLocale(locale);

  const topicsPromise = getAvailableTopics({ showOnlyMyTopics: false });
  const { topics, totalCount } = await topicsPromise;

  return (
    <TopicsContextProvider
      topics={topics}
      totalCount={totalCount}
      namespace={namespace}
      manageScope={scope}
      routePath={routePath}
    >
      {children}
    </TopicsContextProvider>
  );
}
