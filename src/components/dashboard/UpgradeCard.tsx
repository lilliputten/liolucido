import { TPropsWithClassName } from '@/shared/types/generic';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { isDev } from '@/constants';

export function UpgradeCard({ className }: TPropsWithClassName) {
  return (
    <Card
      className={cn(
        isDev && '__UpgradeCard', // DEBUG
        'md:max-xl:rounded-none md:max-xl:border-none md:max-xl:shadow-none',
        'bg-theme/10',
        className,
      )}
    >
      <CardHeader className="md:max-xl:px-4">
        <CardTitle>Upgrade to Pro</CardTitle>
        <CardDescription>
          Unlock all features and get unlimited access to our support team.
        </CardDescription>
      </CardHeader>
      <CardContent className="md:max-xl:px-4">
        <Button size="sm" variant="theme" className="w-full">
          Upgrade
        </Button>
      </CardContent>
    </Card>
  );
}
