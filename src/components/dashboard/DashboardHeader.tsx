import { cn } from '@/lib/utils';
import { isDev } from '@/constants';

import { Icons } from '../shared/icons';
import { Button } from '../ui/button';

interface DashboardHeaderProps {
  heading: string;
  text?: string;
  // children?: React.ReactNode;
  className?: string;
}

function DashboardToolbar() {
  return (
    <div
      className={cn(
        isDev && '__DashboardToolbar', // DEBUG
        'flex flex-wrap gap-2',
      )}
    >
      <Button variant="ghostTheme" size="sm" className="flex gap-2">
        <Icons.check className="size-4 opacity-50" />
        <span>Save</span>
      </Button>
    </div>
  );
}

export function DashboardHeader(props: DashboardHeaderProps) {
  const {
    className,
    heading,
    text,
    // children,
  } = props;
  return (
    <div
      className={cn(
        isDev && '__DashboardHeader', // DEBUG
        'flex items-center justify-between',
        className,
      )}
    >
      <div
        className={cn(
          isDev && '__DashboardHeader_Header', // DEBUG
          'flex flex-col gap-1',
        )}
      >
        <h1 className="font-heading text-2xl font-semibold">{heading}</h1>
        {text && <p className="text-base text-muted-foreground">{text}</p>}
      </div>
      <DashboardToolbar />
    </div>
  );
}
