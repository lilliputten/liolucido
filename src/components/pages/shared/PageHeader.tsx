import { cn } from '@/lib/utils';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { isDev } from '@/constants';

type TProps = React.ComponentProps<typeof DashboardHeader>;
export function PageHeader(props: TProps) {
  const { className, ...rest } = props;
  return (
    <DashboardHeader
      className={cn(
        isDev && '__PageHeader', // DEBUG
        className,
      )}
      {...rest}
    />
  );
}
