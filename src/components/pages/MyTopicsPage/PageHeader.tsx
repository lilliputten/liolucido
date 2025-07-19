import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { isDev } from '@/constants';

export function PageHeader() {
  const t = useTranslations('MyTopicsPage');
  return (
    <DashboardHeader
      className={cn(
        isDev && '__PageHeader', // DEBUG
      )}
      heading={t('title')}
      text={t('description')}
    />
  );
}
