import { cn } from '@/lib/utils';
import { isDev } from '@/constants';

interface DashboardHeaderProps {
  heading: string;
  text?: string;
  children?: React.ReactNode;
  className?: string;
}

export function DashboardHeader({ className, heading, text, children }: DashboardHeaderProps) {
  return (
    <div
      className={cn(
        isDev && '__DashboardHeader', // DEBUG
        'flex items-center justify-between',
        className,
      )}
    >
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-semibold">{heading}</h1>
        {text && <p className="text-base text-muted-foreground">{text}</p>}
      </div>
      {children}
    </div>
  );
}
