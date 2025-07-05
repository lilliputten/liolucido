import { siteConfig } from '@/config/site';
import { commonXPaddingTwStyle } from '@/config/ui';
import { cn } from '@/lib/utils';
import { MaxWidthWrapper } from '@/components/shared/MaxWidthWrapper';
import { isDev } from '@/constants';

interface SiteFooterProps {
  large?: boolean;
}
export function SiteFooter(props: SiteFooterProps) {
  const { large } = props;
  return (
    <div
      className={cn(
        isDev && '__SiteFooter', // DEBUG
        'flex',
        'w-full',
        'bg-muted',
        commonXPaddingTwStyle,
        'justify-center',
      )}
    >
      <MaxWidthWrapper
        className={cn(
          'flex',
          'justify-between',
          'py-1',
          'z-10',
          'opacity-50',
          'flex-col',
          'items-center',
          'sm:flex-row',
        )}
        large={large}
      >
        <div className="flex flex-row items-center gap-3 gap-y-0 max-sm:flex-col">
          <span className="font-normal">{siteConfig.name} </span>
          <span className="text-xs opacity-50">{siteConfig.versionInfo}</span>
        </div>
        {/* // Right side
        <div className="text-xs">{siteConfig.versionInfo}</div>
        */}
      </MaxWidthWrapper>
    </div>
  );
}
