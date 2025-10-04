import { constructMetadata } from '@/lib/constructMetadata';
import { AvailableTopicsPageModalsWrapper } from '@/components/pages/AvailableTopics/AvailableTopicsPageModalsWrapper';
import { TAwaitedLocaleProps } from '@/i18n/types';

type TAwaitedProps = TAwaitedLocaleProps;

export async function generateMetadata({ params }: TAwaitedProps) {
  const { locale } = await params;
  const title = 'Availbale Topics';
  return constructMetadata({
    locale,
    title,
  });
}

export default async function AvailableTopicsPage(/* props: AvailableTopicsPageProps */) {
  // TODO: Pass modal props
  return <AvailableTopicsPageModalsWrapper />;
}
