import { ScrollArea } from '@radix-ui/react-scroll-area';

import { TPropsWithChildrenAndClassName } from '@/shared/types/generic';
import { commonXPaddingTwStyle } from '@/config/ui';
import { cn } from '@/lib/utils';
import { MaxWidthWrapper } from '@/components/shared/MaxWidthWrapper';
import { TLayoutType, UseScrollableLayout } from '@/components/shared/ScrollableLayout';
import { isDev } from '@/constants';

interface TPageWrapperProps extends TPropsWithChildrenAndClassName {
  innerClassName?: string;
  scrollable?: boolean;
  limitWidth?: boolean;
  padded?: boolean;
  layoutType?: TLayoutType;
}

export function PageWrapper(props: TPageWrapperProps) {
  const {
    className,
    children,
    scrollable,
    limitWidth,
    padded,
    layoutType = 'clippable',
    innerClassName,
  } = props;

  let content = children;

  content = (
    <div
      className={cn(
        isDev && '__PageWrapper_InnerWrapper', // DEBUG
        'flex flex-1 flex-col',
        innerClassName,
      )}
    >
      {content}
    </div>
  );

  if (scrollable) {
    content = (
      <ScrollArea
        className={cn(
          isDev && '__PageWrapper_Scroll', // DEBUG
          'flex flex-col items-center',
          'layout-scrollable',
        )}
      >
        {content}
      </ScrollArea>
    );
  }

  if (limitWidth) {
    content = (
      <MaxWidthWrapper
        className={cn(
          isDev && '__PageWrapper_Wrapper', // DEBUG
          'flex flex-1 flex-col',
          'layout-follow',
          'm-auto',
        )}
      >
        {content}
      </MaxWidthWrapper>
    );
  }

  return (
    <div
      className={cn(
        isDev && '__PageWrapper', // DEBUG
        'flex flex-1 flex-col items-center',
        padded && commonXPaddingTwStyle,
        className,
      )}
    >
      <UseScrollableLayout type={layoutType} />
      {content}
    </div>
  );
}
