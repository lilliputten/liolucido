import { siteTitle, versionInfo } from '@/config/env';
import { commonXPaddingTwStyle } from '@/config/ui';
import { cn } from '@/lib/utils';
import { isDev } from '@/constants';

interface SiteFooterProps {
  large?: boolean;
}
export function SiteFooter(_props: SiteFooterProps) {
  // const { large } = props;
  return (
    <div
      className={cn(
        isDev && '__SiteFooter', // DEBUG
        'flex',
        'w-full',
        'bg-theme-400/70 text-white backdrop-blur',
        commonXPaddingTwStyle,
        'max-sm:justify-center',
      )}
    >
      <div // Ex: MaxWidthWrapper
        className={cn(
          'flex',
          'justify-between',
          'py-1',
          'z-10',
          'opacity-50',
          'flex-col',
          'items-center',
          'sm:flex-row',
          'max-sm:text-center',
        )}
        // large={large}
      >
        <div className="flex flex-row items-center gap-3 gap-y-0 max-sm:flex-col">
          <span className="font-normal">{siteTitle} </span>
          <span className="text-xs opacity-50">{versionInfo}</span>
        </div>
        {/* // Right side
        <div className="text-xs">{versionInfo}</div>
        */}
      </div>
    </div>
  );
}
