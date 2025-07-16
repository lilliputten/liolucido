import { useTranslations } from 'next-intl';

import { DashboardHeader } from '@/components/dashboard/DashboardHeader';

export function PageHeader() {
  const t = useTranslations('MyTopicsPage');
  return (
    <DashboardHeader
      // prettier-ignore
      heading={t('title')}
      text={t('description')}
      className="__PageHeader"
    />
  );
}
